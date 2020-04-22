import fs from 'fs';

// import UserService from '../api/users/server/UserService';

// This is useful in development when you need dumps
// it writes a file to the public folder
const writeToPublic = (name, data) => {
  fs.writeFileSync(`../../../../../public/${name}`, data);
};

// Returns a csv from an array of objects with
// values separated by tabs and rows separated by newlines
const arrayToCsv = array => {
  // Use first element to choose the keys and the order
  const keys = Object.keys(array[0]);

  // Build header
  let result = `${keys.join('\t')}\n`;

  // Add the rows
  array.forEach(obj => {
    result += `${keys.map(k => obj[k]).join('\t')}\n`;
  });

  return result;
};

// These samples below

// const exportProsForMarketing = () => {
//   const result = UserService.fetch({
//     $filters: {
//       roles: 'pro',
//     },
//     firstName: 1,
//     lastName: 1,
//     email: 1,
//     organisations: { name: 1 },
//   }).map(({ firstName, lastName, email, organisations }) => {
//     const mainOrg = organisations.find(({ $metadata }) => $metadata.isMain);
//     return {
//       firstName,
//       lastName,
//       email,
//       organisation: mainOrg?.name,
//       title: mainOrg?.$metadata?.title,
//     };
//   });

//   writeToPublic('users.csv', arrayToCsv(result));
// };

// export const exportUsersForMarketing = () => {
//   const result = UserService.fetch({
//     $filters: {
//       roles: 'user',
//     },
//     firstName: 1,
//     lastName: 1,
//     email: 1,
//     loans: { status: 1, updatedAt: 1 },
//   }).map(({ firstName, lastName, email, loans = [] }) => {
//     const [lastUpdatedLoan] = loans.sort(
//       ({ updatedAt: A }, { updatedAt: B }) => B.getTime() - A.getTime(),
//     );
//     return {
//       firstName,
//       lastName,
//       email,
//       status: lastUpdatedLoan?.status,
//     };
//   });

//   writeToPublic('users.csv', arrayToCsv(result));
// };

export default writeToPublic;
