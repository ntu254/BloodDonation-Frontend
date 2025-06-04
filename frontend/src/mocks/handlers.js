// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { API_URL } from '../config'; // Đảm bảo đường dẫn này đúng

const mockUser = {
    id: 1,
    username: 'mockuser',
    email: 'mock.user@example.com',
    fullName: 'Mock User Test',
    phone: '0123456789',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    address: '123 Mock Street, Mock City',
    latitude: 10.123,
    longitude: 106.456,
    emergencyContact: 'Mock Emergency 0987654321',
    bloodType: { id: 1, bloodGroup: 'O', rhFactor: '+', description: 'O Positive (Mock)' },
    bloodTypeId: 1,
    bloodTypeDescription: 'O Positive (Mock)',
    medicalConditions: 'None',
    lastDonationDate: '2023-01-01',
    isReadyToDonate: true,
    role: 'Member', // 'Admin', 'Staff', 'Member'
    status: 'Active', // 'Active', 'Suspended', 'Pending'
    emailVerified: true,
    phoneVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const adminUserList = (page, size) => {
    const totalElements = 35;
    const totalPages = Math.ceil(totalElements / size);
    const content = Array.from({ length: size }, (_, i) => {
        const id = page * size + i + 1;
        if (id > totalElements) return null;
        return {
            id: id,
            username: `user${id}`,
            email: `user${id}.mock@example.com`,
            fullName: `Mock User ${id}`,
            phone: `0123${id.toString().padStart(6, '0')}`,
            dateOfBirth: '1995-05-05',
            gender: id % 2 === 0 ? 'Female' : 'Male',
            address: `${id} Test Address, Mock City`,
            role: id % 4 === 0 ? 'Admin' : (id % 4 === 1 ? 'Staff' : 'Member'),
            status: id % 3 === 0 ? 'Suspended' : (id % 3 === 1 ? 'Pending' : 'Active'),
            emailVerified: id % 2 === 0,
            phoneVerified: id % 2 !== 0,
            createdAt: new Date(Date.now() - (totalElements - id) * 1000 * 60 * 60 * 24).toISOString(),
            bloodTypeDescription: 'A+ (Mock)',
        };
    }).filter(user => user !== null);

    return {
        content,
        pageable: {
            sort: { sorted: true, unsorted: false, empty: false },
            offset: page * size,
            pageNumber: page,
            pageSize: size,
            paged: true,
            unpaged: false,
        },
        last: page >= totalPages - 1,
        totalPages,
        totalElements,
        size,
        number: page,
        sort: { sorted: true, unsorted: false, empty: false },
        first: page === 0,
        numberOfElements: content.length,
        empty: content.length === 0,
    };
};

const mockRoles = [
    { id: 1, name: "Guest", description: "Public users (MSW)..." },
    { id: 2, name: "Member", description: "Registered users (MSW)..." },
    { id: 3, name: "Staff", description: "Medical staff (MSW)..." },
    { id: 4, name: "Admin", description: "System admins (MSW)..." },
];

let mockBloodTypes = [
    { id: 1, bloodGroup: "A", rhFactor: "+", description: "A Positive (MSW)", createdAt: new Date().toISOString() },
    { id: 2, bloodGroup: "O", rhFactor: "-", description: "O Negative (MSW)", createdAt: new Date().toISOString() },
    { id: 3, bloodGroup: "B", rhFactor: "+", description: "B Positive (MSW)", createdAt: new Date().toISOString() },
    { id: 4, bloodGroup: "AB", rhFactor: "+", description: "AB Positive (MSW)", createdAt: new Date().toISOString() },
];

let mockBloodComponents = [
    { id: 1, name: "Whole Blood", description: "Full blood unit (MSW)", shelfLifeDays: 35, storageTempMin: 1, storageTempMax: 6, volumeMl: 450, createdAt: new Date().toISOString() },
    { id: 2, name: "Red Blood Cells", description: "Packed red cells (MSW)", shelfLifeDays: 42, storageTempMin: 1, storageTempMax: 6, volumeMl: 250, createdAt: new Date().toISOString() },
    { id: 3, name: "Platelets", description: "Platelet concentrate (MSW)", shelfLifeDays: 5, storageTempMin: 20, storageTempMax: 24, volumeMl: 50, createdAt: new Date().toISOString() },
];

let mockCompatibilityRules = [
    { id: 1, donorBloodType: mockBloodTypes[0], recipientBloodType: mockBloodTypes[0], bloodComponent: mockBloodComponents[0], isCompatible: true, isEmergencyCompatible: false, compatibilityScore: 100, notes: "A+ to A+ (Whole Blood) is fully compatible.", createdAt: new Date().toISOString() },
    { id: 2, donorBloodType: mockBloodTypes[1], recipientBloodType: mockBloodTypes[0], bloodComponent: mockBloodComponents[1], isCompatible: true, isEmergencyCompatible: true, compatibilityScore: 80, notes: "O- to A+ (RBC) is emergency compatible.", createdAt: new Date().toISOString() },
];


export const handlers = [
    // AuthService
    http.post(`${API_URL}/auth/register`, async ({ request }) => {
        const reqBody = await request.json();
        console.log('MSW Registered:', reqBody);
        // Giả lập thành công
        return HttpResponse.json({ message: "User registered successfully (MSW)" }, { status: 201 });
        // Hoặc giả lập lỗi
        // return HttpResponse.json({ message: "Email already exists (MSW)" }, { status: 400 });
    }),

    http.post(`${API_URL}/auth/login`, async ({ request }) => {
        const { email, password } = await request.json();
        console.log('MSW Login attempt:', email);
        if (password === "password") { // Simple password check for mock
            let userToLogin = { ...mockUser };
            if (email.includes("admin")) {
                userToLogin.role = "Admin";
                userToLogin.fullName = "Mock Admin";
                userToLogin.email = email;
            } else {
                userToLogin.role = "Member";
                userToLogin.fullName = "Mock Member";
                userToLogin.email = email;
            }
            return HttpResponse.json({
                accessToken: `msw-token-for-${email}`,
                refreshToken: 'msw-refresh-token',
                ...userToLogin
            });
        }
        return HttpResponse.json({ message: "Invalid credentials (MSW)" }, { status: 401 });
    }),

    // UserService - Admin
    http.get(`${API_URL}/admin/users`, ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 0;
        const size = parseInt(url.searchParams.get('size')) || 10;
        // const sort = url.searchParams.get('sort'); // Bạn có thể thêm logic sort ở đây nếu muốn
        console.log(`MSW GET /admin/users: page=${page}, size=${size}`);
        return HttpResponse.json(adminUserList(page, size));
    }),

    http.post(`${API_URL}/admin/users`, async ({ request }) => {
        const newUser = await request.json();
        const createdUser = { ...newUser, id: Date.now(), createdAt: new Date().toISOString() };
        // Thêm vào danh sách mock nếu muốn, nhưng thường không cần thiết cho test UI đơn giản
        console.log('MSW Created User by Admin:', createdUser);
        return HttpResponse.json(createdUser, { status: 201 });
    }),

    http.get(`${API_URL}/admin/users/:userId`, ({ params }) => {
        const { userId } = params;
        const id = parseInt(userId);
        console.log(`MSW: Fetching user detail for ID: ${id}`);

        // Bạn có thể tạo một đối tượng mock chi tiết hơn cho từng user
        // hoặc sử dụng lại mockUser và điều chỉnh
        const detailedMockUsers = {
            1: { // Dữ liệu cho user ID 1
                id: 1,
                fullName: "Mock User 1 Detail View",
                username: "mockuser1_detail",
                email: "mockuser1.detail@example.com",
                phone: "0123456789",
                dateOfBirth: "1990-01-01",
                gender: "Male",
                address: "123 Mock Street, Mock City, Detail",
                latitude: 10.123,
                longitude: 106.456,
                emergencyContact: "Mock Emergency 0987654321",
                bloodTypeDescription: "O Positive (Mock Detail)", // Đảm bảo trường này có
                medicalConditions: "None for mock user 1 detail",
                lastDonationDate: "2023-01-15",
                isReadyToDonate: true,
                role: "Member",
                status: "Active",
                emailVerified: true,
                phoneVerified: false,
                createdAt: new Date(Date.now() - 15 * 1000 * 60 * 60 * 24).toISOString(),
                updatedAt: new Date().toISOString(),
            },
            // Thêm các user khác nếu cần test với ID khác
        };

        const foundUser = detailedMockUsers[id];

        if (foundUser) {
            console.log("MSW: Found user data for detail view:", foundUser);
            return HttpResponse.json(foundUser);
        } else {
            // Lấy một user từ danh sách adminUserList nếu không có mock chi tiết riêng
            const userList = adminUserList(0, 50).content;
            const genericUser = userList.find(u => u && u.id === id);
            if (genericUser) {
                console.log("MSW: Found generic user data for detail view:", genericUser);
                // Bổ sung các trường còn thiếu cho genericUser nếu cần thiết cho trang chi tiết
                const detailedGenericUser = {
                    ...genericUser,
                    username: genericUser.username || `user${id}_generic`,
                    phone: genericUser.phone || 'N/A',
                    dateOfBirth: genericUser.dateOfBirth || 'N/A',
                    gender: genericUser.gender || 'N/A',
                    address: genericUser.address || 'N/A',
                    latitude: genericUser.latitude || null,
                    longitude: genericUser.longitude || null,
                    emergencyContact: genericUser.emergencyContact || 'N/A',
                    bloodTypeDescription: genericUser.bloodTypeDescription || 'Not Set (Mock)',
                    medicalConditions: genericUser.medicalConditions || 'N/A',
                    lastDonationDate: genericUser.lastDonationDate || null,
                    isReadyToDonate: genericUser.isReadyToDonate !== undefined ? genericUser.isReadyToDonate : true,
                    updatedAt: new Date().toISOString(),
                };
                return HttpResponse.json(detailedGenericUser);
            }
            console.log(`MSW: User with ID ${id} not found for detail view.`);
            return HttpResponse.json({ message: `User with ID ${id} not found (MSW)` }, { status: 404 });
        }
    }),

    http.put(`${API_URL}/admin/users/:userId`, async ({ request, params }) => {
        const updatedData = await request.json();
        const { userId } = params;
        console.log(`MSW Updated User ${userId} by Admin:`, updatedData);
        return HttpResponse.json({ ...mockUser, ...updatedData, id: parseInt(userId) });
    }),

    http.delete(`${API_URL}/admin/users/:userId`, ({ params }) => {
        const { userId } = params;
        console.log(`MSW Soft Deleted User ${userId} by Admin`);
        return HttpResponse.json({ message: `User ${userId} soft deleted (MSW)` });
    }),

    // UserService - Common data
    http.get(`${API_URL}/roles`, () => {
        console.log('MSW GET /roles');
        return HttpResponse.json(mockRoles);
    }),

    // UserService - General User Profile
    http.get(`${API_URL}/users/me/profile`, () => {
        console.log('MSW GET /users/me/profile');
        // Giả sử user đã login là mockUser
        return HttpResponse.json(mockUser);
    }),

    http.put(`${API_URL}/users/me/profile`, async ({ request }) => {
        const updatedData = await request.json();
        Object.assign(mockUser, updatedData); // Cập nhật mockUser
        console.log('MSW Updated User Profile:', mockUser);
        return HttpResponse.json(mockUser);
    }),


    // BloodTypeService
    http.get(`${API_URL}/blood-types`, () => {
        console.log('MSW GET /blood-types');
        return HttpResponse.json(mockBloodTypes);
    }),
    http.get(`${API_URL}/blood-types/:id`, ({ params }) => {
        const found = mockBloodTypes.find(bt => bt.id === parseInt(params.id));
        return HttpResponse.json(found || null, { status: found ? 200 : 404 });
    }),
    http.post(`${API_URL}/blood-types`, async ({ request }) => {
        const data = await request.json();
        const newBloodType = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
        mockBloodTypes.push(newBloodType);
        return HttpResponse.json(newBloodType, { status: 201 });
    }),
    http.put(`${API_URL}/blood-types/:id`, async ({ request, params }) => {
        const data = await request.json();
        const index = mockBloodTypes.findIndex(bt => bt.id === parseInt(params.id));
        if (index > -1) {
            mockBloodTypes[index] = { ...mockBloodTypes[index], ...data };
            return HttpResponse.json(mockBloodTypes[index]);
        }
        return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }),
    http.delete(`${API_URL}/blood-types/:id`, ({ params }) => {
        const idToDelete = parseInt(params.id);
        const initialLength = mockBloodTypes.length;
        mockBloodTypes = mockBloodTypes.filter(bt => bt.id !== idToDelete); // Cập nhật mảng mockBloodTypes
        console.log(`MSW DELETE /blood-types/${idToDelete}, new list:`, mockBloodTypes);

        if (mockBloodTypes.length < initialLength) {
            // Theo chuẩn HTTP, DELETE thành công thường trả về 204 No Content
            // Hoặc 200 OK với một message body (ít phổ biến hơn cho DELETE)
            // Hoặc 202 Accepted nếu hành động là bất đồng bộ
            return new HttpResponse(null, { status: 204 });
        }
        return HttpResponse.json({ message: "Blood Type not found (MSW)" }, { status: 404 });
    }),


    // BloodComponentService
    http.get(`${API_URL}/blood-components`, () => {
        return HttpResponse.json(mockBloodComponents);
    }),
    http.post(`${API_URL}/blood-components`, async ({ request }) => {
        const data = await request.json();
        const newComponent = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
        mockBloodComponents.push(newComponent);
        return HttpResponse.json(newComponent, { status: 201 });
    }),
    http.put(`${API_URL}/blood-components/:id`, async ({ request, params }) => {
        const data = await request.json();
        const index = mockBloodComponents.findIndex(bc => bc.id === parseInt(params.id));
        if (index > -1) {
            mockBloodComponents[index] = { ...mockBloodComponents[index], ...data };
            return HttpResponse.json(mockBloodComponents[index]);
        }
        return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }),
    http.delete(`${API_URL}/blood-components/:id`, ({ params }) => {
        const initialLength = mockBloodComponents.length;
        mockBloodComponents = mockBloodComponents.filter(bc => bc.id !== parseInt(params.id));
        if (mockBloodComponents.length < initialLength) {
            return new HttpResponse(null, { status: 204 });
        }
        return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }),


    // BloodCompatibilityService
    http.get(`${API_URL}/blood-compatibility`, ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 0;
        const size = parseInt(url.searchParams.get('size')) || 10;
        const totalElements = mockCompatibilityRules.length;
        const totalPages = Math.ceil(totalElements / size);
        const content = mockCompatibilityRules.slice(page * size, (page + 1) * size);
        return HttpResponse.json({
            content, totalPages, totalElements, number: page, size,
            first: page === 0, last: page >= totalPages - 1,
            // ... các thuộc tính khác của Page
        });
    }),
    http.post(`${API_URL}/blood-compatibility`, async ({ request }) => {
        const data = await request.json();
        const donorBloodType = mockBloodTypes.find(bt => bt.id === data.donorBloodTypeId);
        const recipientBloodType = mockBloodTypes.find(bt => bt.id === data.recipientBloodTypeId);
        const bloodComponent = data.bloodComponentId ? mockBloodComponents.find(bc => bc.id === data.bloodComponentId) : null;

        const newRule = {
            ...data,
            id: Date.now(),
            donorBloodType,
            recipientBloodType,
            bloodComponent,
            compatibilityScore: parseFloat(data.compatibilityScore), // Đảm bảo là số
            createdAt: new Date().toISOString()
        };
        mockCompatibilityRules.push(newRule);
        console.log("MSW: Created new compatibility rule", newRule);
        return HttpResponse.json(newRule, { status: 201 });
    }),

    http.put(`${API_URL}/blood-compatibility/:id`, async ({ request, params }) => {
        const data = await request.json();
        const index = mockCompatibilityRules.findIndex(r => r.id === parseInt(params.id));
        if (index >= 0) {
            const donorBloodType = mockBloodTypes.find(bt => bt.id === data.donorBloodTypeId);
            const recipientBloodType = mockBloodTypes.find(bt => bt.id === data.recipientBloodTypeId);
            const bloodComponent = data.bloodComponentId ? mockBloodComponents.find(bc => bc.id === data.bloodComponentId) : null;
            mockCompatibilityRules[index] = {
                ...mockCompatibilityRules[index],
                ...data,
                donorBloodType,
                recipientBloodType,
                bloodComponent,
                compatibilityScore: parseFloat(data.compatibilityScore), // Đảm bảo là số
            };
            console.log("MSW: Updated compatibility rule", mockCompatibilityRules[index]);
            return HttpResponse.json(mockCompatibilityRules[index]);
        }
        return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }),
    http.delete(`${API_URL}/blood-compatibility/:id`, ({ params }) => {
        const initialLength = mockCompatibilityRules.length;
        mockCompatibilityRules = mockCompatibilityRules.filter(r => r.id !== parseInt(params.id));
        if (mockCompatibilityRules.length < initialLength) {
            return new HttpResponse(null, { status: 204 });
        }
        return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }),
];