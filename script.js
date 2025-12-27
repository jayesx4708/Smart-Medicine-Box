// Smart Medicine Box Pro - Complete JavaScript Implementation

// Global Variables and State Management
let currentUser = null;
let medicineData = [];
let inventoryData = [];
let caretakers = [];
let alerts = [];
let currentTheme = 'light';

// Sample data for demonstration
const sampleUsers = {
  'CARD001': {
    id: 'CARD001',
    name: 'John Doe',
    age: 45,
    gender: 'male',
    disease: 'Hypertension',
    symptoms: 'High blood pressure, occasional headaches',
    doctor: 'Dr. Smith',
    contact: '+1234567890'
  },
  'CARD002': {
    id: 'CARD002',
    name: 'Mary Johnson',
    age: 62,
    gender: 'female',
    disease: 'Diabetes Type 2',
    symptoms: 'Elevated blood sugar, fatigue',
    doctor: 'Dr. Williams',
    contact: '+1987654321'
  }
};

const sampleMedicines = {
  'CARD001': [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      time: '08:00',
      frequency: 'daily',
      uses: 'Blood pressure control',
      stock: 30,
      remaining: 25,
      expiry: '2025-12-31'
    },
    {
      id: 2,
      name: 'Aspirin',
      dosage: '81mg',
      time: '20:00',
      frequency: 'daily',
      uses: 'Heart health and blood thinning',
      stock: 60,
      remaining: 45,
      expiry: '2025-10-15'
    }
  ],
  'CARD002': [
    {
      id: 3,
      name: 'Metformin',
      dosage: '500mg',
      time: '07:00',
      frequency: 'twice-daily',
      uses: 'Blood sugar control',
      stock: 60,
      remaining: 40,
      expiry: '2025-11-20'
    },
    {
      id: 4,
      name: 'Glipizide',
      dosage: '5mg',
      time: '18:00',
      frequency: 'daily',
      uses: 'Diabetes management',
      stock: 30,
      remaining: 20,
      expiry: '2025-09-30'
    }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  setupMobileMenu();
  loadTheme();
});

function initializeApp() {
  // Set initial states
  showSection('dashboard');
  updateDashboard();
  updateScheduleTable();
  updateInventoryTable();
  updateAlertsList();
  
  // Setup form event listeners
  setupFormEventListeners();
  
  console.log('Smart Medicine Box Pro initialized');
}

// DateTime Functions
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
}

// Mobile Menu Functions
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const sidebar = document.getElementById('sidebar');
  
  mobileMenuBtn.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
  });
  
  mobileOverlay.addEventListener('click', function() {
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
  });
}

// RFID Simulation Functions
function simulateRFIDScan() {
  const rfidStatus = document.getElementById('rfidStatus');
  rfidStatus.textContent = 'Scanning...';
  
  // Simulate scanning delay
  setTimeout(() => {
    const cardIds = Object.keys(sampleUsers);
    const randomCard = cardIds[Math.floor(Math.random() * cardIds.length)];
    loadUserData(randomCard);
    rfidStatus.textContent = `Card ${randomCard} detected`;
    
    // Show success message
    setTimeout(() => {
      rfidStatus.textContent = 'Ready to scan';
    }, 3000);
  }, 2000);
}

function loadUserData(cardId) {
  currentUser = sampleUsers[cardId];
  if (currentUser) {
    // Update user info in sidebar
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userId').textContent = `ID: ${currentUser.id}`;
    document.getElementById('userStatus').textContent = 'Active User';
    document.getElementById('welcomeUserName').textContent = currentUser.name;
    
    // Load user's medicine data
    medicineData = sampleMedicines[cardId] || [];
    inventoryData = [...medicineData];
    
    // Update all sections
    updateDashboard();
    updateScheduleTable();
    updateInventoryTable();
    loadUserProfile();
    generateAlerts();
    
    console.log(`User ${currentUser.name} logged in successfully`);
  }
}

// Navigation Functions
function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => section.classList.remove('active'));
  
  // Show selected section
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  
  // Find and activate the clicked nav item
  const activeNavItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
  if (activeNavItem) {
    activeNavItem.classList.add('active');
  }
  
  // Close mobile menu if open
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('mobileOverlay').classList.remove('active');
}

// Dashboard Functions
function updateDashboard() {
  if (!currentUser || medicineData.length === 0) {
    document.getElementById('nextDose').textContent = 'No medicines scheduled';
    document.getElementById('totalPills').textContent = '0 remaining';
    document.getElementById('lastTaken').textContent = 'No record';
    document.getElementById('activeAlerts').textContent = '0 notifications';
    return;
  }
  
  // Calculate next dose
  const now = new Date();
  const todayTimes = medicineData.map(med => {
    const [hours, minutes] = med.time.split(':');
    const medTime = new Date();
    medTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return { medicine: med, time: medTime };
  }).filter(item => item.time > now).sort((a, b) => a.time - b.time);
  
  if (todayTimes.length > 0) {
    const nextMed = todayTimes[0];
    document.getElementById('nextDose').textContent = 
      `${nextMed.medicine.name} at ${nextMed.medicine.time}`;
  } else {
    document.getElementById('nextDose').textContent = 'No more doses today';
  }
  
  // Calculate total pills
  const totalPills = medicineData.reduce((sum, med) => sum + med.remaining, 0);
  document.getElementById('totalPills').textContent = `${totalPills} remaining`;
  
  // Mock last taken (would be from actual tracking)
  document.getElementById('lastTaken').textContent = 'Today 07:00 AM';
  
  // Active alerts count
  document.getElementById('activeAlerts').textContent = `${alerts.length} notifications`;
}

// Schedule Functions
function updateScheduleTable() {
  const tbody = document.getElementById('schedule-table');
  
  if (!currentUser || medicineData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No medicines scheduled. Please scan RFID to load data.</td></tr>';
    return;
  }
  
  tbody.innerHTML = medicineData.map(med => `
    <tr>
      <td><strong>${med.name}</strong></td>
      <td>${med.dosage}</td>
      <td>${formatTime(med.time)}</td>
      <td><span class="badge">${formatFrequency(med.frequency)}</span></td>
      <td>${med.uses}</td>
      <td>
        <button onclick="editMedicine(${med.id})" class="btn-sm">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button onclick="deleteMedicine(${med.id})" class="btn-sm btn-danger">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

// Inventory Functions
function updateInventoryTable() {
  const tbody = document.getElementById('inventory-table');
  
  if (!currentUser || inventoryData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No inventory data. Please scan RFID to load data.</td></tr>';
    return;
  }
  
  tbody.innerHTML = inventoryData.map(med => {
    const status = getStockStatus(med);
    return `
      <tr>
        <td><strong>${med.name}</strong></td>
        <td>${med.stock}</td>
        <td>${med.remaining}</td>
        <td>${formatDate(med.expiry)}</td>
        <td><span class="status-badge ${status.class}">${status.text}</span></td>
        <td>
          <button onclick="restockMedicine(${med.id})" class="btn-sm">
            <i class="fas fa-plus"></i> Restock
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function getStockStatus(medicine) {
  const percentage = (medicine.remaining / medicine.stock) * 100;
  const expiryDate = new Date(medicine.expiry);
  const today = new Date();
  const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysToExpiry < 30) {
    return { class: 'expiring', text: 'Expiring Soon' };
  } else if (percentage < 20) {
    return { class: 'low', text: 'Low Stock' };
  } else if (percentage < 50) {
    return { class: 'medium', text: 'Medium Stock' };
  } else {
    return { class: 'good', text: 'Good Stock' };
  }
}

// Medicine Management Functions
function showAddMedicineForm() {
  document.getElementById('addMedicineModal').classList.add('active');
}

function closeAddMedicineForm() {
  document.getElementById('addMedicineModal').classList.remove('active');
  document.getElementById('addMedicineForm').reset();
}

function setupFormEventListeners() {
  // Add Medicine Form
  document.getElementById('addMedicineForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addNewMedicine();
  });
}

function addNewMedicine() {
  const form = document.getElementById('addMedicineForm');
  const formData = new FormData(form);
  
  const newMedicine = {
    id: Date.now(), // Simple ID generation
    name: document.getElementById('medicineName').value,
    dosage: document.getElementById('medicineDosage').value,
    time: document.getElementById('medicineTime').value,
    frequency: document.getElementById('medicineFrequency').value,
    uses: document.getElementById('medicineUses').value,
    stock: parseInt(document.getElementById('medicineStock').value),
    remaining: parseInt(document.getElementById('medicineStock').value),
    expiry: document.getElementById('medicineExpiry').value
  };
  
  medicineData.push(newMedicine);
  inventoryData.push({...newMedicine});
  
  updateScheduleTable();
  updateInventoryTable();
  updateDashboard();
  generateAlerts();
  closeAddMedicineForm();
  
  showNotification('Medicine added successfully!', 'success');
}

function editMedicine(id) {
  const medicine = medicineData.find(med => med.id === id);
  if (medicine) {
    // Pre-fill the form with existing data
    document.getElementById('medicineName').value = medicine.name;
    document.getElementById('medicineDosage').value = medicine.dosage;
    document.getElementById('medicineTime').value = medicine.time;
    document.getElementById('medicineFrequency').value = medicine.frequency;
    document.getElementById('medicineUses').value = medicine.uses;
    document.getElementById('medicineStock').value = medicine.stock;
    document.getElementById('medicineExpiry').value = medicine.expiry;
    
    showAddMedicineForm();
    
    // Change form submission to update instead of add
    const form = document.getElementById('addMedicineForm');
    form.onsubmit = function(e) {
      e.preventDefault();
      updateMedicine(id);
    };
  }
}

function updateMedicine(id) {
  const index = medicineData.findIndex(med => med.id === id);
  if (index !== -1) {
    medicineData[index] = {
      ...medicineData[index],
      name: document.getElementById('medicineName').value,
      dosage: document.getElementById('medicineDosage').value,
      time: document.getElementById('medicineTime').value,
      frequency: document.getElementById('medicineFrequency').value,
      uses: document.getElementById('medicineUses').value,
      stock: parseInt(document.getElementById('medicineStock').value),
      expiry: document.getElementById('medicineExpiry').value
    };
    
    // Update inventory as well
    const invIndex = inventoryData.findIndex(med => med.id === id);
    if (invIndex !== -1) {
      inventoryData[invIndex] = {...medicineData[index]};
    }
    
    updateScheduleTable();
    updateInventoryTable();
    updateDashboard();
    closeAddMedicineForm();
    
    showNotification('Medicine updated successfully!', 'success');
  }
}

function deleteMedicine(id) {
  if (confirm('Are you sure you want to delete this medicine?')) {
    medicineData = medicineData.filter(med => med.id !== id);
    inventoryData = inventoryData.filter(med => med.id !== id);
    
    updateScheduleTable();
    updateInventoryTable();
    updateDashboard();
    generateAlerts();
    
    showNotification('Medicine deleted successfully!', 'success');
  }
}

function restockMedicine(id) {
  const quantity = prompt('Enter restock quantity:');
  if (quantity && !isNaN(quantity)) {
    const medicine = inventoryData.find(med => med.id === id);
    if (medicine) {
      medicine.remaining += parseInt(quantity);
      medicine.stock += parseInt(quantity);
      
      // Update in medicine data as well
      const medIndex = medicineData.findIndex(med => med.id === id);
      if (medIndex !== -1) {
        medicineData[medIndex].remaining += parseInt(quantity);
        medicineData[medIndex].stock += parseInt(quantity);
      }
      
      updateInventoryTable();
      updateDashboard();
      generateAlerts();
      
      showNotification(`Restocked ${quantity} units successfully!`, 'success');
    }
  }
}

// Control Panel Functions
function testConnection() {
  const statusDiv = document.getElementById('connectionStatus');
  statusDiv.textContent = 'Testing connection...';
  
  setTimeout(() => {
    const isConnected = Math.random() > 0.2; // 80% success rate
    statusDiv.textContent = isConnected ? 'Status: Connected' : 'Status: Connection Failed';
    showNotification(
      isConnected ? 'Connection test successful!' : 'Connection test failed!',
      isConnected ? 'success' : 'error'
    );
  }, 2000);
}

function syncData() {
  const lastSyncDiv = document.getElementById('lastSync');
  lastSyncDiv.textContent = 'Syncing...';
  
  setTimeout(() => {
    const now = new Date();
    lastSyncDiv.textContent = `Last sync: ${now.toLocaleString()}`;
    showNotification('Data synced successfully!', 'success');
  }, 3000);
}

// Alerts Functions
function generateAlerts() {
  alerts = [];
  
  if (!currentUser || medicineData.length === 0) {
    updateAlertsList();
    return;
  }
  
  // Check for low stock
  inventoryData.forEach(med => {
    const percentage = (med.remaining / med.stock) * 100;
    if (percentage < 20) {
      alerts.push({
        type: 'medicine',
        priority: 'urgent',
        title: 'Low Stock Alert',
        message: `${med.name} is running low (${med.remaining} remaining)`,
        timestamp: new Date()
      });
    }
  });
  
  // Check for expiring medicines
  inventoryData.forEach(med => {
    const expiryDate = new Date(med.expiry);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry < 30 && daysToExpiry > 0) {
      alerts.push({
        type: 'medicine',
        priority: 'medium',
        title: 'Medicine Expiring Soon',
        message: `${med.name} expires in ${daysToExpiry} days`,
        timestamp: new Date()
      });
    }
  });
  
  // Add system alerts
  if (Math.random() > 0.7) {
    alerts.push({
      type: 'system',
      priority: 'low',
      title: 'System Update Available',
      message: 'A new software update is available for your Smart Medicine Box',
      timestamp: new Date()
    });
  }
  
  updateAlertsList();
  updateDashboard();
}

function updateAlertsList() {
  const alertsList = document.getElementById('alerts-list');
  
  if (alerts.length === 0) {
    alertsList.innerHTML = `
      <li class="alert-item">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>No active alerts</strong>
          <p>All systems are running normally</p>
        </div>
      </li>
    `;
    return;
  }
  
  alertsList.innerHTML = alerts.map(alert => `
    <li class="alert-item ${alert.priority}">
      <i class="fas fa-${getAlertIcon(alert.type)}"></i>
      <div>
        <strong>${alert.title}</strong>
        <p>${alert.message}</p>
        <small>${alert.timestamp.toLocaleString()}</small>
      </div>
    </li>
  `).join('');
}

function filterAlerts(filter) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => btn.classList.remove('active'));
  
  const activeBtn = document.querySelector(`[onclick="filterAlerts('${filter}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(alert => 
    alert.type === filter || alert.priority === filter
  );
  
  const alertsList = document.getElementById('alerts-list');
  if (filteredAlerts.length === 0) {
    alertsList.innerHTML = `
      <li class="alert-item">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>No ${filter} alerts</strong>
          <p>No alerts found for this filter</p>
        </div>
      </li>
    `;
    return;
  }
  
  alertsList.innerHTML = filteredAlerts.map(alert => `
    <li class="alert-item ${alert.priority}">
      <i class="fas fa-${getAlertIcon(alert.type)}"></i>
      <div>
        <strong>${alert.title}</strong>
        <p>${alert.message}</p>
        <small>${alert.timestamp.toLocaleString()}</small>
      </div>
    </li>
  `).join('');
}

function getAlertIcon(type) {
  const icons = {
    medicine: 'pills',
    system: 'cog',
    urgent: 'exclamation-triangle'
  };
  return icons[type] || 'info-circle';
}

// Profile Functions
function loadUserProfile() {
  if (!currentUser) return;
  
  document.getElementById('profileName').value = currentUser.name || '';
  document.getElementById('profileGender').value = currentUser.gender || '';
  document.getElementById('profileAge').value = currentUser.age || '';
  document.getElementById('profileDisease').value = currentUser.disease || '';
  document.getElementById('profileSymptoms').value = currentUser.symptoms || '';
  document.getElementById('profileDoctor').value = currentUser.doctor || '';
  document.getElementById('profileContact').value = currentUser.contact || '';
}

function saveProfile() {
  if (!currentUser) {
    showNotification('Please scan RFID card first', 'error');
    return;
  }
  
  currentUser.name = document.getElementById('profileName').value;
  currentUser.gender = document.getElementById('profileGender').value;
  currentUser.age = parseInt(document.getElementById('profileAge').value);
  currentUser.disease = document.getElementById('profileDisease').value;
  currentUser.symptoms = document.getElementById('profileSymptoms').value;
  currentUser.doctor = document.getElementById('profileDoctor').value;
  currentUser.contact = document.getElementById('profileContact').value;
  
  // Update UI
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('welcomeUserName').textContent = currentUser.name;
  
  showNotification('Profile saved successfully!', 'success');
}

// Caretaker Functions
function addCaretaker() {
  const name = document.getElementById('caretakerName').value;
  const relation = document.getElementById('caretakerRelation').value;
  const phone = document.getElementById('caretakerPhone').value;
  const email = document.getElementById('caretakerEmail').value;
  
  if (!name || !relation || !phone) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  const newCaretaker = {
    id: Date.now(),
    name,
    relation,
    phone,
    email,
    addedDate: new Date()
  };
  
  caretakers.push(newCaretaker);
  updateCaretakersList();
  
  // Clear form
  document.getElementById('caretakerForm').reset();
  
  showNotification('Caretaker added successfully!', 'success');
}

function updateCaretakersList() {
  const caretakersList = document.getElementById('caretakers-list');
  
  if (caretakers.length === 0) {
    caretakersList.innerHTML = `
      <li class="caretaker-item">
        <div class="caretaker-info">
          <strong>No caretakers added</strong>
          <p>Add caretakers to receive notifications</p>
        </div>
      </li>
    `;
    return;
  }
  
  caretakersList.innerHTML = caretakers.map(caretaker => `
    <li class="caretaker-item">
      <div class="caretaker-info">
        <strong>${caretaker.name}</strong>
        <p>${formatRelation(caretaker.relation)} • ${caretaker.phone}</p>
        ${caretaker.email ? `<p>${caretaker.email}</p>` : ''}
      </div>
      <button onclick="removeCaretaker(${caretaker.id})" class="btn-sm btn-danger">
        <i class="fas fa-trash"></i>
      </button>
    </li>
  `).join('');
}

function removeCaretaker(id) {
  if (confirm('Are you sure you want to remove this caretaker?')) {
    caretakers = caretakers.filter(caretaker => caretaker.id !== id);
    updateCaretakersList();
    showNotification('Caretaker removed successfully!', 'success');
  }
}

// Theme Functions
function setTheme(theme) {
  currentTheme = theme;
  document.body.setAttribute('data-theme', theme);
  
  // Update theme buttons
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => btn.classList.remove('active'));
  
  const activeBtn = document.querySelector(`[onclick="setTheme('${theme}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Save theme preference
  localStorage.setItem('smart-medicine-theme', theme);
  
  showNotification(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied!`, 'success');
}

function loadTheme() {
  const savedTheme = localStorage.getItem('smart-medicine-theme') || 'light';
  setTheme(savedTheme);
}

// Utility Functions
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function formatFrequency(frequency) {
  const frequencies = {
    'daily': 'Daily',
    'twice-daily': '2x Daily',
    'thrice-daily': '3x Daily',
    'weekly': 'Weekly',
    'as-needed': 'As Needed'
  };
  return frequencies[frequency] || frequency;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatRelation(relation) {
  const relations = {
    'family': 'Family Member',
    'friend': 'Friend',
    'nurse': 'Nurse',
    'doctor': 'Doctor',
    'other': 'Other'
  };
  return relations[relation] || relation;
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${getNotificationIcon(type)}"></i>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

// Alarm Functions (for future implementation)
function enableAlarms() {
  const enabled = document.getElementById('alarmEnabled').checked;
  const volume = document.getElementById('alarmVolume').value;
  
  console.log(`Alarms ${enabled ? 'enabled' : 'disabled'} with volume ${volume}%`);
  showNotification(`Alarms ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

// Auto-generate alerts on page load
setTimeout(() => {
  if (currentUser) {
    generateAlerts();
  }
}, 3000);

// Export functions for global access
window.simulateRFIDScan = simulateRFIDScan;
window.showSection = showSection;
window.showAddMedicineForm = showAddMedicineForm;
window.closeAddMedicineForm = closeAddMedicineForm;
window.editMedicine = editMedicine;
window.deleteMedicine = deleteMedicine;
window.restockMedicine = restockMedicine;
window.testConnection = testConnection;
window.syncData = syncData;
window.filterAlerts = filterAlerts;
window.saveProfile = saveProfile;
window.addCaretaker = addCaretaker;
window.removeCaretaker = removeCaretaker;
window.setTheme = setTheme;

console.log('Smart Medicine Box Pro JavaScript loaded successfully!');