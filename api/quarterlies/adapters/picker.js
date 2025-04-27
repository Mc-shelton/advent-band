const picker = (origin, pick) => {
    const picked = Object.create({});
    pick.forEach((d) => {
        picked[d] = origin[d];
    });
    return picked;
};

export {
    picker
}