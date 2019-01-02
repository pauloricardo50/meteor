process.on('uncaughtException', (error) => {
  console.log('uncaughtException error', error);
});
process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection error', error);
});
