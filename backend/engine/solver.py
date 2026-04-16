import numpy as np
import math
from typing import List, Dict, Any
from .models import NodeData, MemberData  # Assuming files are in the same folder

def solve_frame(nodes: List[NodeData], members: List[MemberData]) -> Dict[str, Any]:
    num_nodes = len(nodes)
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
    
    # Generate Settlement Vector
    U_settlements = np.zeros(total_dofs)
    
    for i, row in enumerate(nodes):
        n_dof = dof_map[i]
        # Nodal Loads
        F_global[n_dof[0]] += row.H
        F_global[n_dof[1]] += row.V
        F_global[n_dof[2]] += row.M
        # Assign Support Settlements (Bonus Feature)
        if row.u == 0: U_settlements[n_dof[0]] = row.settle_u
        if row.v == 0: U_settlements[n_dof[1]] = row.settle_v
        if row.theta == 0: U_settlements[n_dof[2]] = row.settle_theta
        
    member_data_cache = []
    node_id_to_idx = {n.id: i for i, n in enumerate(nodes)}

    for row in members:
        n1 = node_id_to_idx[row.node_i]
        n2 = node_id_to_idx[row.node_j]
        
        # Instantiate member to get T and k_local easily
        from .models import Member, Node
        # Dummy nodes just to pass x,y coords for Length/Angle calc
        node_i_dummy = Node(row.node_i, node_coords[row.node_i][0], node_coords[row.node_i][1], [], [])
        node_j_dummy = Node(row.node_j, node_coords[row.node_j][0], node_coords[row.node_j][1], [], [])
        
        mem = Member(
            id=row.id, node_i=node_i_dummy, node_j=node_j_dummy, 
            area=row.area, moi=row.moi, e=row.e, 
            udl=row.udl, point_load=row.point_load
        )
        # Apply arbitrary attributes
        mem.point_load_a = row.point_load_a
        mem.w1 = row.w1
        mem.w2 = row.w2
        
        k_local = mem.local_stiffness()
        T = mem.translation_matrix()
        
        k_g_e = T.T @ k_local @ T
        g_dofs = np.concatenate((dof_map[n1], dof_map[n2]))
        
        # Assemble Global Stiffness Matrix
        for r in range(6):
            for col in range(6):
                K_global[g_dofs[r], g_dofs[col]] += k_g_e[r, col]
                
        # Handle Local Fixed End Forces (FEF)
        f_l = mem.fixed_end_forces()
        f_g_e = T.T @ f_l
        for r in range(6):
            fixed_end_forces_global[g_dofs[r]] += f_g_e[r]
            
        member_data_cache.append({'id': row.id, 'k_local': k_local, 'T': T, 'dofs': g_dofs, 'f_l_fixed': f_l})
        
    # Solve System equations: K_ff * U_f = F_net - (K_fs * U_s)
    F_net = F_global - fixed_end_forces_global
    
    # Apply Settlement Modifiers
    F_net_effective = F_net - (K_global @ U_settlements)
    
    free_dofs = np.where(dof_status == 1)[0]
    fixed_dofs = np.where(dof_status == 0)[0]
    
    if len(free_dofs) > 0:
        U_f = np.linalg.solve(K_global[np.ix_(free_dofs, free_dofs)], F_net_effective[free_dofs])
    else:
        U_f = np.array([])
        
    # Combine settlements (knowns) with calculated displacements (unknowns)
    U_total = U_settlements.copy()
    U_total[free_dofs] = U_f
    
    # 1) FORMAT DISPLACEMENTS
    disps_dict = {}
    for i, row in enumerate(nodes):
        disps_dict[row.id] = {
            'dx': float(U_total[dof_map[i][0]]),
            'dy': float(U_total[dof_map[i][1]]),
            'theta': float(U_total[dof_map[i][2]])
        }
        
    # 2) FORMAT SUPPORT REACTIONS
    if len(fixed_dofs) > 0:
        R = K_global[np.ix_(fixed_dofs, np.arange(total_dofs))] @ U_total + fixed_end_forces_global[fixed_dofs] - F_global[fixed_dofs]
    else:
        R = np.array([])
        
    reacts_dict = {}
    for i, row in enumerate(nodes):
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

    # 3) FORMAT MEMBER END FORCES 
    mem_forces_dict = {}
    for m in member_data_cache:
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