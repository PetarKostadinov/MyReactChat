const toId = (value) => String(value?._id ?? value ?? '');

const isSameUser = (firstUser, secondUser) =>
    Boolean(toId(firstUser)) && toId(firstUser) === toId(secondUser);

const isChatMember = (members, user) =>
    Array.isArray(members) && members.some((member) => isSameUser(member, user));

const isGroupAdmin = (groupAdmin, user) => isSameUser(groupAdmin, user);

const canRemoveGroupMember = (groupAdmin, actingUser, targetUser) =>
    isGroupAdmin(groupAdmin, actingUser) || isSameUser(actingUser, targetUser);

module.exports = {
    canRemoveGroupMember,
    isChatMember,
    isGroupAdmin,
    isSameUser,
};
