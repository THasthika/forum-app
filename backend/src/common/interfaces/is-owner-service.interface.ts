export interface IIsOwnerService {
  isOwner(id: string, userId: string): Promise<boolean>;
}
