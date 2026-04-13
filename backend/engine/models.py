from pydantic import BaseModel
from typing import List, Tuple
import numpy as np
import math

class NodeData(BaseModel):
    id: int
    x: float
    y: float
    u: int  # 1 = free, 0 = fixed
    v: int  
    theta: int
    H: float
    V: float
    M: float

class MemberData(BaseModel):
    id: int
    node_i: int
    node_j: int
    area: float
    moi: float
    e: float
    udl: float = 0.0
    point_load: float = 0.0
    w1: float = 0.0
    w2: float = 0.0

class Node:
    def __init__(self, id: int, x: float, y: float, bcs: List[int], loads: List[float]):
        self.id = id
        self.x = x
        self.y = y
        self.bcs = bcs # [u_free, v_free, theta_free] e.g. [1,1,1] = free, [0,0,0] = fixed
        self.loads = loads # [Hx, Vy, Mz]
        self.dof_indices = [-1, -1, -1] # Global DOF map

class Member:
    def __init__(self, id: int, node_i: Node, node_j: Node, area: float, moi: float, e: float, udl: float, point_load: float):
        self.id = id
        self.node_i = node_i
        self.node_j = node_j
        self.A = area
        self.I = moi
        self.E = e
        self.udl = udl
        self.point_load = point_load
        
        dx = node_j.x - node_i.x
        dy = node_j.y - node_i.y
        self.L = math.sqrt(dx**2 + dy**2)
        
        self.cos = dx / self.L if self.L > 0 else 1
        self.sin = dy / self.L if self.L > 0 else 0
        
    def local_stiffness(self) -> np.ndarray:
        E, I, A, L = self.E, self.I, self.A, self.L
        k = np.zeros((6, 6))
        
        k[0, 0] = A*E/L
        k[0, 3] = -A*E/L
        k[3, 0] = -A*E/L
        k[3, 3] = A*E/L
        
        k[1, 1] = 12*E*I/(L**3)
        k[1, 2] = 6*E*I/(L**2)
        k[1, 4] = -12*E*I/(L**3)
        k[1, 5] = 6*E*I/(L**2)
        
        k[2, 1] = 6*E*I/(L**2)
        k[2, 2] = 4*E*I/L
        k[2, 4] = -6*E*I/(L**2)
        k[2, 5] = 2*E*I/L
        
        k[4, 1] = -12*E*I/(L**3)
        k[4, 2] = -6*E*I/(L**2)
        k[4, 4] = 12*E*I/(L**3)
        k[4, 5] = -6*E*I/(L**2)
        
        k[5, 1] = 6*E*I/(L**2)
        k[5, 2] = 2*E*I/L
        k[5, 4] = -6*E*I/(L**2)
        k[5, 5] = 4*E*I/L
        
        return k
        
    def translation_matrix(self) -> np.ndarray:
        c, s = self.cos, self.sin
        T = np.zeros((6, 6))
        T[0, 0] = c; T[0, 1] = s
        T[1, 0] = -s; T[1, 1] = c
        T[2, 2] = 1
        T[3, 3] = c; T[3, 4] = s
        T[4, 3] = -s; T[4, 4] = c
        T[5, 5] = 1
        return T
        
    def fixed_end_forces(self) -> np.ndarray:
        fef = np.zeros(6)
        L = self.L
        if self.udl != 0:
            w = self.udl
            fef[1] = -(w * L) / 2
            fef[2] = -(w * L**2) / 12
            fef[4] = -(w * L) / 2
            fef[5] = (w * L**2) / 12
            
        if self.point_load != 0:
            P = self.point_load
            fef[1] -= P / 2
            fef[2] -= (P * L) / 8
            fef[4] -= P / 2
        if hasattr(self, 'w1') and (self.w1 != 0 or self.w2 != 0):
            w1 = self.w1
            w2 = self.w2
            fef[1] -= (w1 * 7 * L) / 20 + (w2 * 3 * L) / 20
            fef[2] -= (w1 * L**2) / 20 + (w2 * L**2) / 30
            fef[4] -= (w1 * 3 * L) / 20 + (w2 * 7 * L) / 20
            fef[5] += (w1 * L**2) / 30 + (w2 * L**2) / 20
            
        return fef
