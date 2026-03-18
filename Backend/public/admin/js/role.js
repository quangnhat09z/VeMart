// Permissions
const tablePermissions = document.getElementById("permissions-table");
if (tablePermissions) {
    const submitButton = document.getElementById("submitPermissions");
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        const permissions = [];

        // Lấy tất cả các hàng có data-name
        const actionRows = tablePermissions.querySelectorAll(`[data-name]`);

        // Lấy tất cả role IDs
        const roleIDs = document.querySelectorAll(".role-ids input");

        roleIDs.forEach((roleInput, roleIndex) => {
            const roleId = roleInput.value;
            const rolePermissions = [];
            actionRows.forEach((row) => {
                const checkbox = row.querySelectorAll('input[type="checkbox"]')[roleIndex];
                if (checkbox && checkbox.checked) {
                    const resourceAction = row.getAttribute('data-name');
                    rolePermissions.push(resourceAction);
                }
            });
            permissions.push({
                roleId: roleId,
                permissions: rolePermissions
            });
        });

        console.log('Collected permissions to submit:', permissions);

        const permissionsInput = document.getElementById("permissionsInput");
        permissionsInput.value = JSON.stringify(permissions);

        document.querySelector("[name='submitPermissionForm']").submit();
    }); 

}

// Checkbox multi
const selectAllCheckbox = document.querySelectorAll('[name="select-all"]');
const selectAllPartialCheckboxes = document.querySelectorAll('[name="select-all-partial"]');
const itemCheckboxes = document.querySelectorAll('[name="checkbox-item"]');

const countRoles = selectAllCheckbox.length;
const countTypes = selectAllPartialCheckboxes.length;
const countItems = itemCheckboxes.length;
const typePerRole = countTypes / countRoles;
const itemsPerType = countItems / countTypes;

// Tạo groups mapping
const groups = {};
const elementToGroup = {};
const coefficient = countRoles * (itemsPerType - 1);

for (let i = 0; i < countTypes; i++) {
    const baseIndex = i + coefficient * Math.floor(i / countRoles);
    const indices = [];
    for (let j = 0; j < itemsPerType; j++) {
        indices.push(baseIndex + j * countRoles);
    }
    groups[i] = indices;
    indices.forEach(elementIndex => {
        elementToGroup[elementIndex] = i;
    });
}

// Helper functions
const isAllRolePartialChecked = (roleIndex) => {
    for (let i = roleIndex; i < countTypes; i += countRoles) {
        if (!selectAllPartialCheckboxes[i].checked) return false;
    }
    return true;
};

const updateSelectAll = (roleIndex) => {
    selectAllCheckbox[roleIndex].checked = isAllRolePartialChecked(roleIndex);
};

const updateItemsInGroup = (groupIndex, checked) => {
    groups[groupIndex].forEach(itemIndex => {
        itemCheckboxes[itemIndex].checked = checked;
    });
};

// Event listeners
selectAllCheckbox.forEach((checkbox, roleIndex) => {
    checkbox.addEventListener('change', function () {
        for (let i = roleIndex; i < countTypes; i += countRoles) {
            selectAllPartialCheckboxes[i].checked = this.checked;
            updateItemsInGroup(i, this.checked);
        }
    });
});

selectAllPartialCheckboxes.forEach((checkbox, groupIndex) => {
    checkbox.addEventListener('change', function () {
        updateItemsInGroup(groupIndex, this.checked);
        
        const roleIndex = groupIndex % countRoles;
        if (!this.checked) {
            selectAllCheckbox[roleIndex].checked = false;
        } else {
            updateSelectAll(roleIndex);
        }
    });
});

itemCheckboxes.forEach((checkbox, itemIndex) => {
    checkbox.addEventListener('change', function () {
        const groupIndex = elementToGroup[itemIndex];
        const roleIndex = itemIndex % countRoles;
        
        if (!this.checked) {
            selectAllCheckbox[roleIndex].checked = false;
            selectAllPartialCheckboxes[groupIndex].checked = false;
        } else {
            const allInGroupChecked = groups[groupIndex].every(i => itemCheckboxes[i].checked);
            if (allInGroupChecked) {
                selectAllPartialCheckboxes[groupIndex].checked = true;
            }
            updateSelectAll(roleIndex);
        }
    });
});
