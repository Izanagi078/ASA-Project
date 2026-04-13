import numpy as np
import math
from typing import List, Dict, Any
from .models import NodeData, MemberData

def solve_frame(nodes: List[NodeData], members: List[MemberData]) -> Dict[str, Any]:
    num_nodes = len(nodes)
    num_members = len(members)
    total_dofs = 3 * num_nodes
    
    dof_map = np.zeros((num_nodes, 3), dtype=int)
    dof_status = []
    
    idx = 0
    node_coords = {}
    
    for i, row in enumerate(nodes):
        node_coords[row.id] = (row.x, row.y)
        dof_map[i] = [idx, idx+1, idx+2]
        dof_status.extend([row.u, row.v, row.theta])
        idx += 3
        
    dof_status = np.array(dof_status)
    K_global = np.zeros((total_dofs, total_dofs))
    F_global = np.zeros(total_dofs)
    fixed_end_forces_global = np.zeros(total_dofs)
    
    # Nodal loads
    for i, row in enumerate(nodes):
        n_dof = dof_map[i]
        F_global[n_dof[0]] += row.H
        F_global[n_dof[1]] += row.V
        F_global[n_dof[2]] += row.M
        
    member_data = []
    node_id_to_idx = {n.id: i for i, n in enumerate(nodes)}

    for row in members:
        n1 = node_id_to_idx[row.node_i]
        n2 = node_id_to_idx[row.node_j]
        
        A, E, I = row.area, row.e, row.moi
        L = math.sqrt((node_coords[row.node_j][0] - node_coords[row.node_i][0])**2 + 
                      (node_coords[row.node_j][1] - node_coords[row.node_i][1])**2)
        UDL, P = row.udl, row.point_load
        w1, w2 = row.w1, row.w2
        
        x1, y1 = node_coords[row.node_i]
        x2, y2 = node_coords[row.node_j]
        theta = math.atan2(y2 - y1, x2 - x1)
        c, s = math.cos(theta), math.sin(theta)
        
        k_local = np.array([
            [E*A/L, 0, 0, -E*A/L, 0, 0],
            [0, 12*E*I/L**3, 6*E*I/L**2, 0, -12*E*I/L**3, 6*E*I/L**2],
            [0, 6*E*I/L**2, 4*E*I/L, 0, -6*E*I/L**2, 2*E*I/L],
            [-E*A/L, 0, 0, E*A/L, 0, 0],
            [0, -12*E*I/L**3, -6*E*I/L**2, 0, 12*E*I/L**3, -6*E*I/L**2],
            [0, 6*E*I/L**2, 2*E*I/L, 0, -6*E*I/L**2, 4*E*I/L]
        ])
        
        T = np.array([
            [c, s, 0, 0, 0, 0], [-s, c, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0],
            [0, 0, 0, c, s, 0], [0, 0, 0, -s, c, 0], [0, 0, 0, 0, 0, 1]
        ])
        
        k_g_e = T.T @ k_local @ T
        g_dofs = np.concatenate((dof_map[n1], dof_map[n2]))
        
        for r in range(6):
            for col in range(6):
                K_global[g_dofs[r], g_dofs[col]] += k_g_e[r, col]
                
        f_l = np.zeros(6)
        if UDL != 0:
            f_l[1] += UDL*L/2; f_l[2] += UDL*L**2/12; f_l[4] += UDL*L/2; f_l[5] += -UDL*L**2/12
        if P != 0:
            f_l[1] += P/2; f_l[2] += P*L/8; f_l[4] += P/2; f_l[5] += -P*L/8
        if w1 != 0 or w2 != 0:
            f_l[1] -= (w1 * 7 * L) / 20 + (w2 * 3 * L) / 20
            f_l[2] -= (w1 * L**2) / 20 + (w2 * L**2) / 30
            f_l[4] -= (w1 * 3 * L) / 20 + (w2 * 7 * L) / 20
            f_l[5] += (w1 * L**2) / 30 + (w2 * L**2) / 20
            
        f_g_e = T.T @ f_l
        for r in range(6):
            fixed_end_forces_global[g_dofs[r]] += f_g_e[r]
            
        member_data.append({'id': row.id, 'k_local': k_local, 'T': T, 'dofs': g_dofs, 'f_l_fixed': f_l})
        
    # System equations: K*U = F_nodal - F_fixed_end
    F_net = F_global - fixed_end_forces_global
    free_dofs = np.where(dof_status == 1)[0]
    fixed_dofs = np.where(dof_status == 0)[0]
    
    if len(free_dofs) > 0:
        U_f = np.linalg.solve(K_global[np.ix_(free_dofs, free_dofs)], F_net[free_dofs])
    else:
        U_f = np.array([])
        
    U_total = np.zeros(total_dofs)
    U_total[free_dofs] = U_f
    
    # 1) DISPLACEMENTS
    disps_dict = {}
    for i, row in enumerate(nodes):
        disps_dict[row.id] = {
            'dx': float(U_total[dof_map[i][0]]),
            'dy': float(U_total[dof_map[i][1]]),
            'theta': float(U_total[dof_map[i][2]])
        }
        
    # 2) SUPPORT REACTIONS
    # R = K_global[fixed_dofs, :] @ U_total + fixed_end_forces_global[fixed_dofs] - F_global[fixed_dofs]
    if len(fixed_dofs) > 0:
        R = K_global[np.ix_(fixed_dofs, np.arange(total_dofs))] @ U_total + fixed_end_forces_global[fixed_dofs] - F_global[fixed_dofs]
    else:
        R = np.array([])
        
    reacts_dict = {}
    for i, row in enumerate(nodes):
        # Determine if this node has fixed DOFs
        if dof_status[dof_map[i][0]] == 0 or dof_status[dof_map[i][1]] == 0 or dof_status[dof_map[i][2]] == 0:
            reacts_dict[row.id] = {'Fx': 0.0, 'Fy': 0.0, 'Mz': 0.0}
            if dof_status[dof_map[i][0]] == 0:
                idx = np.where(fixed_dofs == dof_map[i][0])[0][0]
                reacts_dict[row.id]['Fx'] = float(R[idx])
            if dof_status[dof_map[i][1]] == 0:
                idx = np.where(fixed_dofs == dof_map[i][1])[0][0]
                reacts_dict[row.id]['Fy'] = float(R[idx])
            if dof_status[dof_map[i][2]] == 0:
                idx = np.where(fixed_dofs == dof_map[i][2])[0][0]
                reacts_dict[row.id]['Mz'] = float(R[idx])

    # 3) MEMBER END FORCES 
    mem_forces_dict = {}
    for m in member_data:
        u_local = m['T'] @ U_total[m['dofs']]
        f_end_local = m['k_local'] @ u_local + m['f_l_fixed']
        mem_forces_dict[m['id']] = {
            'Axial_1': float(f_end_local[0]), 'Shear_1': float(f_end_local[1]), 'Moment_1': float(f_end_local[2]),
            'Axial_2': float(f_end_local[3]), 'Shear_2': float(f_end_local[4]), 'Moment_2': float(f_end_local[5])
        }
        
    return {
        'displacements': disps_dict,
        'reactions': reacts_dict,
        'member_forces': mem_forces_dict
    }
