"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_users_dto_1 = require("./create-users.dto");
class UpdateUserDto extends mapped_types_1.PartialType(create_users_dto_1.CreateUserDto) {
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-users.dto.js.map