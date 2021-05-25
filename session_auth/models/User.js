const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    minlength: 2,
  },
  userId: {
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
  phoneNum: {
    type: String,
    required: true,
    minlength: 10,
  },
  activate: {
    data: Boolean,
    default: false,
  },
});

// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ userId });
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
