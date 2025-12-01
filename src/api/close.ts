import SMB2Connection from '../tools/smb2-connection';
import { ExtendedConnection } from '../tools/smb2-connection';

export default function close(this: ExtendedConnection): void {
  SMB2Connection.close(this);
}
