export default handle =>
  new Promise((resolve, reject) => {
    Tracker.autorun(c => {
      if (handle.ready()) {
        c.stop();

        resolve();
      }
    });
  });
