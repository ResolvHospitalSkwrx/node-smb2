import { SMB2Structure } from '../types';
import close from './close';
import create from './create';
import negotiate from './negotiate';
import query_directory from './query_directory';
import read from './read';
import session_setup from './session_setup';
import set_info from './set_info';
import tree_connect from './tree_connect';
import write from './write';

const structureMap: Record<string, SMB2Structure> = {
  close,
  create,
  negotiate,
  query_directory,
  read,
  session_setup,
  set_info,
  tree_connect,
  write,
};

export function getStructure(command: string) {
  return structureMap[command];
}
