export interface IDatabaseManager {
  openConnection(): boolean;
  closeConnection(): boolean;
  executeQuery(query: string): any;
}
