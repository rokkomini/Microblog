const mongoose = require("mongoose");
//brypt bakar ihop hashen och saltet i ett med lösenordet
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Presave callback, måste använda function och inte big arrow
//Kryptera och salta lösen innan det sparas
//Asynkron funktion när man anänder en opration som är långsam
// för att inte frysa programmet
userSchema.pre("save", async function (next) {
    //Anropa bcrypt, anger vad som ska hashas och hur långt det ska vara
    //This hänvisar till det nuvarande objektet, enligt ovan.
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  //next säger bara 'fortsätt!'
  next();
});

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
};
const User = mongoose.model("User", userSchema);

exports.User = User;
