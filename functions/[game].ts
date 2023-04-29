export const onRequestGet: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url);
    console.log(context.params);
    const gameId = context.env.GAME_STATE.idFromName(url.pathname);
    const stub = context.env.GAME_STATE.get(gameId);
        
    return stub.fetch(context.request);
}