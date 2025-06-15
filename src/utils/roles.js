// Role definitions
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    AUTHOR: 'author',
    SELLER: 'seller',
    EDITOR: 'editor',
    USER: 'user'
  };
  
  // Permission definitions
  export const PERMISSIONS = {
    // User management
    MANAGE_USERS: 'manage_users',
    VIEW_USERS: 'view_users',
    
    // Article management
    MANAGE_ARTICLES: 'manage_articles',
    VIEW_ARTICLES: 'view_articles',
    CREATE_ARTICLES: 'create_articles',
    EDIT_ARTICLES: 'edit_articles',
    DELETE_ARTICLES: 'delete_articles',
    
    // Shop management
    MANAGE_SHOP: 'manage_shop',
    VIEW_SHOP: 'view_shop',
    
    // Settings
    MANAGE_SETTINGS: 'manage_settings',
    VIEW_SETTINGS: 'view_settings',
    
    // Role management
    MANAGE_ROLES: 'manage_roles',
    ASSIGN_ROLES: 'assign_roles'
  };
  
  // Role permissions mapping
  export const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: [
      // All permissions
      ...Object.values(PERMISSIONS)
    ],
    
    [ROLES.ADMIN]: [
      // User management
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.MANAGE_USERS,
      
      // Article management
      PERMISSIONS.VIEW_ARTICLES,
      PERMISSIONS.MANAGE_ARTICLES,
      PERMISSIONS.CREATE_ARTICLES,
      PERMISSIONS.EDIT_ARTICLES,
      PERMISSIONS.DELETE_ARTICLES,
      
      // Shop management
      PERMISSIONS.VIEW_SHOP,
      PERMISSIONS.MANAGE_SHOP,
      
      // Settings
      PERMISSIONS.VIEW_SETTINGS,
      PERMISSIONS.MANAGE_SETTINGS,
      
      // Role management (limited)
      PERMISSIONS.VIEW_USERS
    ],
    
    [ROLES.AUTHOR]: [
      // Article management (full access)
      PERMISSIONS.VIEW_ARTICLES,
      PERMISSIONS.MANAGE_ARTICLES,
      PERMISSIONS.CREATE_ARTICLES,
      PERMISSIONS.EDIT_ARTICLES,
      PERMISSIONS.DELETE_ARTICLES
    ],
    
    [ROLES.SELLER]: [
      // Shop management
      PERMISSIONS.VIEW_SHOP,
      PERMISSIONS.MANAGE_SHOP
    ],
    
    [ROLES.EDITOR]: [
      // Article management (limited)
      PERMISSIONS.VIEW_ARTICLES,
      PERMISSIONS.EDIT_ARTICLES
    ],
    
    [ROLES.USER]: [
      // Basic permissions for regular users
      PERMISSIONS.VIEW_ARTICLES
    ]
  };
  
  // Tab permissions mapping
  export const TAB_PERMISSIONS = {
    dashboard: [PERMISSIONS.VIEW_USERS, PERMISSIONS.VIEW_ARTICLES, PERMISSIONS.VIEW_SHOP],
    users: [PERMISSIONS.MANAGE_USERS],
    news: [PERMISSIONS.MANAGE_ARTICLES, PERMISSIONS.CREATE_ARTICLES, PERMISSIONS.EDIT_ARTICLES],
    shop: [PERMISSIONS.MANAGE_SHOP],
    settings: [PERMISSIONS.MANAGE_SETTINGS]
  };
  
  // Function to determine user role based on user data
  export const getUserRole = (user) => {
    if (!user) return null;
    
    // If user has a role field, use it directly
    if (user.role) {
      return user.role;
    }
    
    // Fallback to old system for backward compatibility
    if (user.is_superuser) {
      return ROLES.SUPER_ADMIN;
    }
    
    if (user.is_author && user.is_seller) {
      return ROLES.ADMIN;
    }
    
    if (user.is_author) {
      return ROLES.AUTHOR;
    }
    
    if (user.is_seller) {
      return ROLES.SELLER;
    }
    
    // Default to USER role instead of EDITOR
    return ROLES.USER;
  };
  
  // Function to check if user has specific permission
  export const hasPermission = (user, permission) => {
    const role = getUserRole(user);
    if (!role) return false;
    
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  };
  
  // Function to check if user can access specific tab
  export const canAccessTab = (user, tabName) => {
    const requiredPermissions = TAB_PERMISSIONS[tabName] || [];
    
    if (requiredPermissions.length === 0) return true;
    
    return requiredPermissions.some(permission => hasPermission(user, permission));
  };
  
  // Function to get accessible tabs for user
  export const getAccessibleTabs = (user) => {
    const allTabs = Object.keys(TAB_PERMISSIONS);
    return allTabs.filter(tab => canAccessTab(user, tab));
  };
  
  // Function to check if user can manage other users' roles
  export const canManageRoles = (user) => {
    return hasPermission(user, PERMISSIONS.MANAGE_ROLES) || 
           hasPermission(user, PERMISSIONS.ASSIGN_ROLES);
  };
  
  // Function to check if user can edit specific user
  export const canEditUser = (currentUser, targetUser) => {
    // Super admin can edit anyone
    if (getUserRole(currentUser) === ROLES.SUPER_ADMIN) {
      return true;
    }
    
    // Admin can edit non-super-admin users
    if (getUserRole(currentUser) === ROLES.ADMIN) {
      return getUserRole(targetUser) !== ROLES.SUPER_ADMIN;
    }
    
    // Others can only edit themselves
    return currentUser.id === targetUser.id;
  }; 