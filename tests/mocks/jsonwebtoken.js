const sign = () => 'mock-token';
const verify = () => ({
	userId: 'user-1',
	email: 'user@example.com',
	role: 'user'
});
const decode = () => ({ exp: Math.floor(Date.now() / 1000) + 3600 });

export default { sign, verify, decode };
export { sign, verify, decode };
