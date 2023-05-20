
export function getSender(loggedUser, users) {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export function getSenderFull(loggedUser, users) {
    return users[0]._id === loggedUser._id ? users[1] : users[0].name;
};
export function isSameSender(messages, m, i, userId) {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};
export function isLastMessage(messages, i, userId) {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId._id &&
        messages[messages.length - 1].sender._id

    );
};


