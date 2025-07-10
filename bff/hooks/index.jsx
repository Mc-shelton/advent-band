import useGetApi from "./getapi";
import usePostApi from "./postapi";
import useQuery from "./query";
const baseUrl = 'http://localhost:3122/api/v1/'
// const baseUrl = 'https://api.adventband.org/api/v1/'
// const baseUrl = 'https://newab-production.up.railway.app/api/v1/'

const apiKeys = '78a89b3546274e297c21f5dfbeea4fdf6e7cccde9b9287772613ec800fb10d5769243925addf3e82f7d603bfad1e7441335d18b24e91bfeeb289a6c6dfa317298c7a6ac8bf3e186901535dbe60824d4460d1ad4e25c5763263637864eaea6c5c605e66c40806570a366c8880983eb43472f73040c46a9dd937d63f646aeb8b304e2618210ef4d4f0645de569acc36c2ca9d9d2661496f0ef48e098db0f01edad8df71ca04c9f9c6056973e06ba343984828e58f7cd0a615427e4b823a0e9146fe25bc425b7b1c39217381f0c8cb1a9d9d8c82e1ad54ec2575b03d04cd0be573296f31c80bf7b84608a04b716cb9c22dca36624f97bcdc41239c5d16aa3d9ffaf'

export {
    baseUrl,
    apiKeys,
    useQuery,
    usePostApi,
    useGetApi

}