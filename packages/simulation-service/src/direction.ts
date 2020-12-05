export enum Direction {
  N,
  W,
  S,
  E,
  TOP,
}

export class DirectionHandler {
  public static areOpposite(first: Direction, second: Direction): boolean {
    switch (first) {
      case Direction.TOP:
        return false;
      case Direction.N:
        return second == Direction.S;
      case Direction.E:
        return second == Direction.W;
      case Direction.S:
        return second == Direction.N;
      case Direction.W:
        return second == Direction.E;
    }
  }
}
