const faker = require("faker");
const { User } = require("../models/user");

var fname = ["Aman", "Ashish", "Anil", "Ayush"];
var lname = ["Goel", "Kaushik", "Tripathi", "Seth"];
var interests = [
  "Singing",
  "Cycling",
  "Swimming",
  "Dancing",
  "Acting",
  "Stand-Up"
];
var diseases = ["Cancer", "Arthritis", "Spondalitis", "Diabetes", "Ulcer"];

for (var i = 0; i < 2; i++) {
  var str =
    fname[Math.floor(Math.random() * fname.length)] +
    " " +
    lname[Math.floor(Math.random() * lname.length)];
  var str1 =
    fname[Math.floor(Math.random() * fname.length)].toLowerCase() +
    lname[Math.floor(Math.random() * lname.length)].toLowerCase();

  let randomInterest = interests.sort(() => 0.5 - Math.random()).slice(0, 3);
  let randomDisease = diseases.sort(() => 0.5 - Math.random()).slice(0, 1);

  var user = {
    name: str,
    email: str1 + faker.random.number() + "@gmail.com",
    password: "qwerty12345",
    age: Math.floor(Math.random() * (90 - 50 + 1)) + 60,
    city: faker.address.city(),
    interests: randomInterest,
    diseases: randomDisease
  };

  const newUser = new User(user);

  newUser.save().then(
    user => {
      console.log(user);
    },
    e => {
      console.log(e);
    }
  );
}
