import numpy as np

def calculate(list_input):
    """
    Calculates statistical measures on a 3x3 matrix.
    
    Args:
        list_input (list): List containing 9 numbers
        
    Returns:
        dict: Dictionary containing statistical calculations
        
    Raises:
        ValueError: If input list doesn't contain exactly 9 numbers
    """
    if len(list_input) != 9:
        raise ValueError("List must contain nine numbers.")
        
    matrix = np.array(list_input).reshape(3, 3)
    
    calculations = {
        'mean': [
            list(matrix.mean(axis=0)),
            list(matrix.mean(axis=1)),
            float(matrix.mean())
        ],
        'variance': [
            list(matrix.var(axis=0)),
            list(matrix.var(axis=1)),
            float(matrix.var())
        ],
        'standard deviation': [
            list(matrix.std(axis=0)),
            list(matrix.std(axis=1)),
            float(matrix.std())
        ],
        'max': [
            list(matrix.max(axis=0)),
            list(matrix.max(axis=1)),
            int(matrix.max())
        ],
        'min': [
            list(matrix.min(axis=0)),
            list(matrix.min(axis=1)),
            int(matrix.min())
        ],
        'sum': [
            list(matrix.sum(axis=0)),
            list(matrix.sum(axis=1)),
            int(matrix.sum())
        ]
    }
    
    return calculations