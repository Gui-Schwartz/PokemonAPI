export const checkFetch = (url: string) => {
    let route = url.split("/");
    const checkRoute = () => {
        let idPage = route[route.length - 2];
        return idPage.toString();
    }
    return checkRoute();
}