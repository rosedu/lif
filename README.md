[lif](http://lif.rosedu.org)
===
We are using [shetsee.js](http://github.com/jlord/sheetsee.js) to make the public site display stats for every LIF for which we had tables.

The basic idea is simple. Store the data in a Google spreadsheet, use sheetsee.js do have a nice display of statistics.

**Note**: Use `git clone --recursive` to also clone the shetsee.js repo.

Manual  Deployment
==================

```
ssh lif@rosedu.org
cd lif-stats-frontend/lif
git pull origin master
```
