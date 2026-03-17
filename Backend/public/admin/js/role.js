console.log('Role management script loaded');
// Permissions
const tablePermissions = document.getElementById("permissions-table");
if (tablePermissions) {
    const submitButton = document.getElementById("submitPermissions");
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        const permissions = [];

        // Lấy tất cả các hàng có data-name
        const actionRows = tablePermissions.querySelectorAll(`[data-name]`);
        // console.log('Action rows:', actionRows);

        // Lấy tất cả role IDs
        const roleIDs = document.querySelectorAll(".role-ids input");

        roleIDs.forEach((roleInput, roleIndex) => {
            const roleId = roleInput.value;
            const rolePermissions = [];
            actionRows.forEach((row) => {
                const checkbox = row.querySelectorAll('input[type="checkbox"]')[roleIndex];
                if (checkbox && checkbox.checked) {
                    const resourceAction = row.getAttribute('data-name');
                    // console.log(`Checked permission for role ${roleId}:`, resourceAction);
                    rolePermissions.push(resourceAction);
                }
            });
            permissions.push({
                roleId: roleId,
                permissions: rolePermissions
            });
        });

        console.log('Collected permissions to submit:', permissions);
    });

}