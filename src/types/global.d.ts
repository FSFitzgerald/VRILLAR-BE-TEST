import { Container } from "inversify";

declare global {
  type Nullable<T> = T | null;
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  type PartialDeep<T> = {
    [P in keyof T]?: PartialDeep<T[P]>;
  };

  type Config = {
    mongodb: {
      name: string;
      host: string;
      port: number;
      usersDB: string;
      password: string;
    };
  };
}
