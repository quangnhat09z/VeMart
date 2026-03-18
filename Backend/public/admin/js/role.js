// console.log('Role management script loaded');
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

// Checkbox multi
const selectAllCheckbox = document.querySelectorAll('[name="select-all"]');
const selectAllPartialCheckboxes = document.querySelectorAll('[name="select-all-partial"]');
const itemCheckboxes = document.querySelectorAll('[name="checkbox-item"]');
const countRoles = selectAllCheckbox.length; //3
const countTypes = selectAllPartialCheckboxes.length;//6
const countItems = itemCheckboxes.length;//30

console.log('Count checkboxes:', countRoles, countTypes, countItems);

const typePerRole = countTypes / countRoles; //2
const itemsPerType = countItems / countTypes; //5



const groups = {};

for (let i = 0; i < countTypes; i++) {
    
    const coefficient = countRoles * (itemsPerType - 1);
    const baseIndex = i + coefficient * Math.floor(i / countRoles);
    
    // Tạo mảng indices cho selectAllPartialCheckboxes[i]
    const indices = [];
    for (let j = 0; j < itemsPerType; j++) {
        indices.push(baseIndex + j * countRoles);
    }
    
    groups[i] = indices;
}

console.log('Groups:', groups);


// // console.log('Select all checkbox:', selectAllCheckbox);
// // console.log('Select all partial checkboxes:', selectAllPartialCheckboxes);
// // console.log('Item checkboxes:', itemCheckboxes);
// if (selectAllCheckbox && selectAllPartialCheckboxes && itemCheckboxes) {
//     const countRoles = selectAllCheckbox.length; //2
//     const countTypes = selectAllPartialCheckboxes.length //4
//     const countItems = itemCheckboxes.length; //20
//     const coefficient = countRoles * ((countItems / countTypes) - 1);

//     const group = {};

//     console.log('Count items:', countRoles, countTypes, countItems);

//     // Select all
//     selectAllCheckbox.forEach((checkbox, index) => {
//         checkbox.addEventListener('change', function () {
//             for (let i = index; i < countTypes; i += countRoles) {
//                 selectAllPartialCheckboxes[i].checked = checkbox.checked;
//             }
//         }

//         );
//     });

//     // Select all partial
//     selectAllPartialCheckboxes.forEach((checkbox, index) => {
//         checkbox.addEventListener('change', function () {
//             if (!checkbox.checked) {
//                 const roleIndex = index % countRoles;
//                 selectAllCheckbox[roleIndex].checked = false;
//             }

//             else {
//                 const roleIndex = index % countRoles;
//                 var allCheckPartial = true;
//                 for (let i = roleIndex; i < countTypes; i += countRoles) {
//                     if (!selectAllPartialCheckboxes[i].checked) {
//                         allCheckPartial = false;
//                         break;
//                     }
//                 }
//                 if (allCheckPartial) {
//                     selectAllCheckbox[roleIndex].checked = true;
//                 }

//                 const baseIndex = index + coefficient * Math.floor(index / countRoles);
//                 for (let i = baseIndex; i <= baseIndex + coefficient; i += countRoles) {
//                     itemCheckboxes[i].checked = checkbox.checked;
//                 }
//             }
//         });
//     });
//     console.log('Group:', group);

//     // Item checkboxes
//     itemCheckboxes.forEach((checkbox, index) => {
//         checkbox.addEventListener('change', function () {
//             if (!checkbox.checked) {
//                 const roleIndex = index % countRoles;
//                 selectAllCheckbox[roleIndex].checked = false;


                
//             } else {

//             }
//         });
//     });


// }
