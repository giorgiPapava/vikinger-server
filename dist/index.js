"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
const utils_1 = require("./utils");
const passport_1 = __importDefault(require("./passport"));
exports.prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express_1.default();
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: schema_1.default,
            resolvers: resolvers_1.default,
            context: ({ req }) => ({
                req,
                prisma: exports.prisma,
                userId: req && req.headers.authorization ? utils_1.getUserId(req.headers.authorization) : null,
            }),
        });
        server.applyMiddleware({ app });
        app.use(passport_1.default.initialize());
        app.listen({ port: 4000 });
        app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
        app.get('/auth/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => {
            const user = req.user;
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, utils_1.APP_SECRET);
            res.send(Object.assign(Object.assign({}, req.user), { token }));
        });
    });
}
main()
    .catch((e) => {
    throw e;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.$disconnect();
}));
//# sourceMappingURL=index.js.map