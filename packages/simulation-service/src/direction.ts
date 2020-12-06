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

  public static getOpposite(input: Direction): Direction {
    switch (input) {
      case Direction.TOP:
        return Direction.TOP;
      case Direction.N:
        return Direction.S;
      case Direction.E:
        return Direction.W;
      case Direction.S:
        return Direction.N;
      case Direction.W:
        return Direction.E;
    }
  }

  public static isNS(input: Direction): boolean {
    return input == Direction.N || input == Direction.S;
  }

  public static isWE(input: Direction): boolean {
    return input == Direction.W || input == Direction.E;
  }

  public static isWS(input: Direction): boolean {
    return input == Direction.W || input == Direction.S;
  }

  public static isEN(input: Direction): boolean {
    return input == Direction.N || input == Direction.E;
  }
}
