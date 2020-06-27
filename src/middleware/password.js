const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 'password2';
const myUserName = 'dirs95';
const mySalt = '$2b$10$asfM3y1iABlUU1MLf7yyyO';
const debug = require('debug')('app:password');

// generate salt and hash
async function createHashWithSalt(password) {
  let hash;
  let salt;
  try {
    const resultSalt = await bcrypt.genSalt(saltRounds);
    const resultHash = await bcrypt.hash(password, resultSalt);

    salt = resultSalt;
    hash = resultHash;
  } catch (error) {
    debug(error);
  }

  return {
    userHash: hash,
    userSalt: salt,
  };
}

// generate hash from password and salt
async function getHashFromDb(password, salt) {
  let hash;
  try {
    const result = await bcrypt.hash(password, salt);
    hash = result;
  } catch (error) {
    debug(error);
  }
  return hash;
}

async function checkUser(username, password) {
  // fetch user from a db etc.
  const myHash = await getHashFromDb(password, mySalt);

  const user = {
    username,
    passwordHash: myHash,
    salt: mySalt,
  };
  debug('_______________________________________');
  debug('user entered password:', password);
  debug('user: ', user);
  debug('_______________________________________');

  // compare password from database with plain text entry
  try {
    const match = await bcrypt.compare(password, user.passwordHash);

    if (match) {
      // login
      debug('password is a match');
    } else {
      // reject
      debug('password not a match');
    }
  } catch (error) {
    debug(error);
  }
}


checkUser(myUserName, myPlaintextPassword);
createHashWithSalt(myPlaintextPassword);
