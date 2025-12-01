import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';

const fileInfoClasses: { [key: string]: number } = {
  FileAllocationInformation: 19,
  FileBasicInformation: 4,
  FileDispositionInformation: 13,
  FileEndOfFileInformation: 20,
  FileFullEaInformation: 15,
  FileLinkInformation: 11,
  FileModeInformation: 16,
  FilePipeInformation: 23,
  FilePositionInformation: 14,
  FileRenameInformation: 10,
  FileShortNameInformation: 40,
  FileValidDataLengthInformation: 39,
};

export default message({
  generate(connection: SMB2Connection, params: any) {
    return new SMB2Message({
      headers: {
        Command: 'SET_INFO',
        SessionId: connection.SessionId,
        TreeId: connection.TreeId,
        ProcessId: connection.ProcessId,
      },
      request: {
        FileInfoClass: fileInfoClasses[params.FileInfoClass],
        FileId: params.FileId,
        Buffer: params.Buffer,
      },
    });
  },
});
