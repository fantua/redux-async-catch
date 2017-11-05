export default handler => store => next => async action => {
    try {
        return await next(action);
    } catch (e) {
        store.dispatch(handler(e, action));

        return e;
    }
}