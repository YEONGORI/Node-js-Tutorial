const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  nickname: {
    type: String,
    required: true,
    minlength: 2,
  },
});

// userSchema.pre("save", async (next) => {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ user_id });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error("비밀번호 오류");
//   }
//   throw Error("아이디 오류");
// };

const User = mongoose.model("user", userSchema);

module.exports = User;

//  ID 중복 검사 if 중복 중복안내메세지 else 사용가능 메세지
//  PW 최소길이 알파벳/숫자/특수 기호 모두 사용
//  닉네임 중복검사
