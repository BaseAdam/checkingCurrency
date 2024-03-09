import { Application } from './application';

const main = async (): Promise<void> => {
  try {
    await Application.start();
  } catch (error) {
    console.error(error);
  }
};

main();
