export function get_grid_position(Position, GridSize) {
    if (GridSize == null) {
        GridSize = 64
    }

    let GridPosition = Position / GridSize
    GridPosition = Math.floor(GridPosition)

    GridPosition = GridPosition * GridSize
    return GridPosition
}