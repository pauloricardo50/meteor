const getCombinations = items => {
  const result = [];
  var f = function(keyarr, items, lvl) {
    for (let i = 0; i < items.length; i++) {
      const nka = keyarr.concat(items[i]);
      result.push(nka);
      f(nka, items.slice(i + 1), lvl + 1);
    }
  };
  f([], items, 0);
  return result;
};

const createPivotFacets = (dims, measures) => {
  const fcts = {};

  // This is where we build the $project stage to turn
  //   sum_q1: nnn
  //   avg_q1: nnn
  //   max_q1: nnn
  // into
  //   q1: { sum:nnn, avg:nnn, ... }
  // Only need to do this once; the $project is the same for all
  // variations of $group.
  const prj = { _id: 1, _x: 1, _n: 1 };
  measures.forEach(m => {
    const z = {};
    ['sum', 'avg', 'max', 'min'].forEach(f => {
      z[f] = `$${f}_${m}`;
      prj[m] = z;
    });
  });

  const combinations = getCombinations(dims);

  for (let i = 0; i < combinations.length; i++) {
    const karr = combinations[i];
    const parr = dims.filter(i => karr.indexOf(i) < 0);

    const grp = {};

    const idd = {};
    karr.forEach(k => {
      idd[k] = `$${k}`;
    });
    grp._id = idd;

    if (parr.length > 0) {
      const pdd = {};
      measures.forEach(m => {
        pdd[m] = `$${m}`;
      });

      parr.forEach(k => {
        pdd[k] = `$${k}`;
      });
      grp._x = { $push: pdd };
    }

    grp._n = { $sum: 1 }; // handy but basically {$size: "$_x"}

    measures.forEach(m => {
      ['sum', 'avg', 'max', 'min'].forEach(f => {
        const z = {};
        z[`$${f}`] = `$${m}`;
        grp[`${f}_${m}`] = z;
      });
    });

    fcts[karr.join(':')] = [{ $group: grp }, { $project: prj }];
  }

  return { $facet: fcts };
};

// USAGE:

// pipe = [createPivotFacets(['region', 'year', 'state'], ['q1', 'q2', 'q3'])];
// db.collection.aggregate(pipe);

// RESULT:

// {
//   "region" : [
//     {
//       "_id" : { "region" : "B" },
//       "_x" : [
//         {"q1" : 8,"q2" : 2,"q3" : 3,"year" : 2001,"state" : "NY"},
//         {"q1" : 1,"q2" : 2,"q3" : 3,"year" : 2001,"state" : "NJ"},
//         {"q1" : 8,"q2" : 32,"q3" : 43,"year" : 2002,"state" : "NY"},
//         {"q1" : 9,"q2" : 32,"q3" : 43,"year" : 2002,"state" : "NJ"}
//       ],
//       "_n" : 4,
//       "q1" : {"sum" : 26,"avg" : 6.5,"max" : 9,"min" : 1},
//       "q2" : {"sum" : 68,"avg" : 17,"max" : 32,"min" : 2},
//       "q3" : {"sum" : 92,"avg" : 23,"max" : 43,"min" : 3}
//     },
//     {
//       "_id" : { "region" : "A" },
//       "_x" : [
//         {"q1" : 1,"q2" : 2,"q3" : 3,"year" : 2001,"state" : "MA"},
//         {"q1" : 6,"q2" : 2,"q3" : 3,"year" : 2001,"state" : "NH"},
//         {"q1" : 1,"q2" : 2,"q3" : 3,"year" : 2001,"state" : "CT"},
//         {"q1" : 52,"q2" : 32,"q3" : 43,"year" : 2002,"state" : "MA"},
//         {"q1" : 21,"q2" : 32,"q3" : 43,"year" : 2002,"state" : "NH"},
//         {"q1" : 67,"q2" : 32,"q3" : 43,"year" : 2002,"state" : "CT"}
//       ],
//       "_n" : 6,
//       "q1" : {"sum" : 148,"avg" : 24.666666666666668,"max" : 67,"min" : 1},
//       "q2" : {"sum" : 102,"avg" : 17,"max" : 32,"min" : 2},
//       "q3" : {"sum" : 138,"avg" : 23,"max" : 43,"min" : 3}
//     }
//   ],
//   "region:year" : [
//     {
//       "_id" : { "region" : "B", "year" : 2002 },
//       "_x" : [
//         {"q1" : 8,"q2" : 32,"q3" : 43,"state" : "NY"},
//         {"q1" : 9,"q2" : 32,"q3" : 43,"state" : "NJ"}
//       ],
//       "_n" : 2,
//       "q1" : {"sum" : 17,"avg" : 8.5,"max" : 9,"min" : 8},
//       "q2" : {"sum" : 64,"avg" : 32,"max" : 32,"min" : 32},
//       "q3" : {"sum" : 86,"avg" : 43,"max" : 43,"min" : 43}
//     },
//     {
//       "_id" : { "region" : "A", "year" : 2002 },
//       "_x" : [
//         {"q1" : 52,"q2" : 32,"q3" : 43,"state" : "MA"},
//         {"q1" : 21,"q2" : 32,"q3" : 43,"state" : "NH"},
//         {"q1" : 67,"q2" : 32,"q3" : 43,"state" : "CT"}
//       ],
//       "_n" : 3,
//       "q1" : {"sum" : 140,"avg" : 46.666666666666664,"max" : 67,"min" : 21},
//       "q2" : {"sum" : 96,"avg" : 32,"max" : 32,"min" : 32},
//       "q3" : {"sum" : 129,"avg" : 43,"max" : 43,"min" : 43}
//     },
// ...
