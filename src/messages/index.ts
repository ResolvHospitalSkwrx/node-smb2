import { MessageConfig } from '../tools/message';
import close from './close';
import create from './create';
import create_folder from './create_folder';
import negotiate from './negotiate';
import open from './open';
import open_folder from './open_folder';
import query_directory from './query_directory';
import read from './read';
import session_setup_step1 from './session_setup_step1';
import session_setup_step2 from './session_setup_step2';
import set_info from './set_info';
import tree_connect from './tree_connect';
import write from './write';

const messageMap: Record<string, MessageConfig> = {
  close,
  create,
  create_folder,
  negotiate,
  open,
  open_folder,
  query_directory,
  read,
  session_setup_step1,
  session_setup_step2,
  set_info,
  tree_connect,
  write,
};

export function getMessage(messageName: string) {
  return messageMap[messageName];
}
