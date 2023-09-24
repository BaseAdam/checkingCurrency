import { Application } from './application';

const main = async () => {
  try {
    await Application.start();
  } catch (error) {
    console.error(error);
  }
};

main();
