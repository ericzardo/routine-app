export interface Document {
  id: string;
  name: string;
  type: "folder" | "file";
  modified: string;
  content?: Document[];
}

export interface Alarm {
  id: string;
  name: string;
  time: string;
  repeat: string;
  sound: string;
  isActive: boolean;
}

export interface Profile {
  id: string;
  name: string;
  userId: string;
  documents: Document[];
  alarms: Alarm[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  profiles: Profile[];
}
