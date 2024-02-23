import { Application } from './application';
import { Config } from './config/config';

const main = async (): Promise<void> => {
  try {
    await Application.start(new Config());
  } catch (error) {
    console.error(error);
  }
};

main();
