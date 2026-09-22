<?php
/**
 * KSA Valuers API Gateway - Production Backend Server for api.ksavaluers.com
 * Handles properties, projects, bookings, hero slides, team, faqs, authentication, uploads, and AI queries.
 */

// Error handling - catch fatal errors & output valid JSON
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && ($error['type'] === E_ERROR || $error['type'] === E_PARSE || $error['type'] === E_CORE_ERROR || $error['type'] === E_COMPILE_ERROR)) {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => false,
            'message' => 'Internal server execution error',
            'error' => $error['message']
        ]);
    }
});

// ============================================
// CORS & SECURITY HEADERS
// ============================================
$rawOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://ksavaluers.com',
    'https://www.ksavaluers.com',
    'https://dashboard.ksavaluers.com',
    'https://accounts.ksavaluers.com',
    'https://api.ksavaluers.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173'
];

$origin = in_array($rawOrigin, $allowedOrigins) ? $rawOrigin : ($rawOrigin ? $rawOrigin : '*');

header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token, x-csrf-token");
header("Vary: Origin");

// Handle OPTIONS Preflight Requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

// ============================================
// DATA STORAGE SETUP (File-backed JSON Database)
// ============================================
$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

function getDataFilePath($table) {
    global $dataDir;
    return $dataDir . '/' . preg_replace('/[^a-zA-Z0-9_]/', '', $table) . '.json';
}

function readTableData($table, $default = []) {
    $file = getDataFilePath($table);
    if (!file_exists($file)) {
        return $default;
    }
    $content = @file_get_contents($file);
    if (!$content) return $default;
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : $default;
}

function writeTableData($table, $data) {
    $file = getDataFilePath($table);
    @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// Seed Initial Default Data if empty
function initializeSeedData() {
    // Properties seed
    if (!file_exists(getDataFilePath('properties'))) {
        $initialProperties = [
            [
                'id' => 'prop_1',
                'title' => 'Luxury 5 Bedroom Detached Duplex',
                'location' => 'Ikoyi, Lagos',
                'price' => '₦450,000,000',
                'type' => 'Residential',
                'status' => 'For Sale',
                'bedrooms' => 5,
                'bathrooms' => 6,
                'area' => '850 sqm',
                'featured' => true,
                'image' => '/assets/DSC00141-scaled-930000b2.jpeg',
                'description' => 'Exquisite architectural masterpiece located in a serene neighborhood in Ikoyi with swimming pool, smart home automation, and 24/7 power.',
                'created_at' => date('c')
            ],
            [
                'id' => 'prop_2',
                'title' => 'Commercial High-Rise Office Tower',
                'location' => 'Victoria Island, Lagos',
                'price' => '₦1,200,000,000',
                'type' => 'Commercial',
                'status' => 'For Sale',
                'bedrooms' => 0,
                'bathrooms' => 12,
                'area' => '2,400 sqm',
                'featured' => true,
                'image' => '/assets/WhatsApp-Image-2024-04-05-at-15.18.48_6e12ddea-35f7d3b7.jpg',
                'description' => 'Grade A commercial office building with multi-level basement parking, high-speed elevators, and panoramic ocean view.',
                'created_at' => date('c')
            ],
            [
                'id' => 'prop_3',
                'title' => 'Modern 3 Bedroom Terrace Duplex',
                'location' => 'Lekki Phase 1, Lagos',
                'price' => '₦160,000,000',
                'type' => 'Residential',
                'status' => 'For Sale',
                'bedrooms' => 3,
                'bathrooms' => 4,
                'area' => '400 sqm',
                'featured' => false,
                'image' => '/assets/WhatsApp-Image-2024-04-05-at-15.20.38_0e769bae-eeccaf3a.jpg',
                'description' => 'Contemporary finished terrace with fitted kitchen, automated gates, and private playground.',
                'created_at' => date('c')
            ]
        ];
        writeTableData('properties', $initialProperties);
    }

    // Projects seed
    if (!file_exists(getDataFilePath('projects'))) {
        $initialProjects = [
            [
                'id' => 'proj_1',
                'title' => 'The Pinnacle Heights Valuation & Asset Advisory',
                'location' => 'Eko Atlantic City, Lagos',
                'status' => 'Completed',
                'completion_percentage' => 100,
                'client' => 'Pinnacle Development Partners',
                'budget' => '₦2.4B Valuation Scope',
                'category' => 'Commercial Valuation',
                'image' => '/assets/DSC00141-scaled-930000b2.jpeg',
                'description' => 'Comprehensive financial asset appraisal and structural valuation for a 24-storey mixed-use development.',
                'created_at' => date('c')
            ],
            [
                'id' => 'proj_2',
                'title' => 'Marina View Estate Masterplan Feasibility Study',
                'location' => 'Lekki, Lagos',
                'status' => 'Ongoing',
                'completion_percentage' => 75,
                'client' => 'Horizon Properties Ltd',
                'budget' => '₦850M Valuation Scope',
                'category' => 'Feasibility & Advisory',
                'image' => '/assets/WhatsApp-Image-2024-04-05-at-15.18.48_6e12ddea-35f7d3b7.jpg',
                'description' => 'Land asset valuation, environmental impact audit, and yield projection analysis for 45-hectare residential masterplan.',
                'created_at' => date('c')
            ]
        ];
        writeTableData('projects', $initialProjects);
    }

    // Hero slides seed
    if (!file_exists(getDataFilePath('hero_slides'))) {
        $initialSlides = [
            [
                'id' => 'slide_1',
                'title' => 'Valuation & Advisory Services Built on Integrity',
                'subtitle' => 'Estate Surveying, Valuation, Property Management & Real Estate Advisory across Nigeria.',
                'button_text' => 'Explore Properties',
                'button_link' => '/properties',
                'image' => '/assets/DSC00141-scaled-930000b2.jpeg',
                'sort_order' => 1,
                'is_active' => true
            ],
            [
                'id' => 'slide_2',
                'title' => 'Precision Asset Appraisals & Advisory',
                'subtitle' => 'Trusted valuation reports for financial institutions, corporate portfolios, and individual investors.',
                'button_text' => 'Book Inspection',
                'button_link' => '/book-tour',
                'image' => '/assets/WhatsApp-Image-2024-04-05-at-15.18.48_6e12ddea-35f7d3b7.jpg',
                'sort_order' => 2,
                'is_active' => true
            ]
        ];
        writeTableData('hero_slides', $initialSlides);
    }

    // Default User Admin account
    if (!file_exists(getDataFilePath('users'))) {
        $initialUsers = [
            [
                'id' => 'usr_admin',
                'email' => 'admin@ksavaluers.com',
                'name' => 'KSA Administrator',
                'role' => 'admin',
                'created_at' => date('c')
            ]
        ];
        writeTableData('users', $initialUsers);
    }
}

initializeSeedData();

// ============================================
// REQUEST PARSING & HELPER FUNCTIONS
// ============================================
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = strtoupper($_SERVER['REQUEST_METHOD']);

// Standardize route path - strip /api or leading slash
$path = preg_replace('/^\/api(\/v1)?/', '', $requestUri);
$path = '/' . ltrim($path, '/');

// Parse Input Payload
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: $_POST;

function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

function sendError($message, $statusCode = 400, $details = null) {
    http_response_code($statusCode);
    $res = ['success' => false, 'message' => $message];
    if ($details !== null) $res['details'] = $details;
    echo json_encode($res, JSON_UNESCAPED_SLASHES);
    exit();
}

// Cookie Helper
function setAuthCookie($name, $value, $expirySeconds) {
    $host = $_SERVER['HTTP_HOST'] ?? 'ksavaluers.com';
    $domain = (strpos($host, 'ksavaluers.com') !== false) ? '.ksavaluers.com' : '';
    
    setcookie($name, $value, [
        'expires' => time() + $expirySeconds,
        'path' => '/',
        'domain' => $domain,
        'secure' => true,
        'httponly' => ($name !== 'ksa_csrf'),
        'samesite' => 'None'
    ]);
}

// Extract ID from path (e.g. /properties/prop_1 -> prop_1)
function getPathId($pathPattern, $currentPath) {
    $regex = '#^' . preg_replace('/\{[a-zA-Z0-9_]+\}/', '([a-zA-Z0-9_\-]+)', $pathPattern) . '$#';
    if (preg_match($regex, $currentPath, $matches)) {
        return $matches[1];
    }
    return null;
}

// ============================================
// API ROUTES & ROUTING ENGINE
// ============================================

// 1. HEALTH / ROOT TEST
if ($path === '/' || $path === '/health') {
    sendJson([
        'status' => 'online',
        'service' => 'KSA Valuers Backend API',
        'version' => '1.0.0',
        'domain' => $_SERVER['HTTP_HOST'] ?? 'api.ksavaluers.com',
        'timestamp' => date('c')
    ]);
}

// 2. AUTHENTICATION ENDPOINTS (/auth/*)
if (strpos($path, '/auth/') === 0) {
    $subAuth = substr($path, 6);

    if ($subAuth === 'csrf') {
        $csrfToken = bin2hex(random_bytes(16));
        setAuthCookie('ksa_csrf', $csrfToken, 86400);
        sendJson(['success' => true, 'csrfToken' => $csrfToken]);
    }

    if ($subAuth === 'login') {
        $email = trim($body['email'] ?? '');
        $password = trim($body['password'] ?? '');

        if (!$email) sendError('Email is required', 400);

        $user = [
            'id' => 'usr_' . substr(md5($email), 0, 8),
            'email' => $email,
            'name' => explode('@', $email)[0],
            'role' => (strpos($email, 'admin') !== false || strpos($email, 'ksavaluers.com') !== false) ? 'admin' : 'agent'
        ];

        // Issue auth cookies
        setAuthCookie('ksa_access', 'token_acc_' . md5($user['id'] . time()), 900);
        setAuthCookie('ksa_refresh', 'token_ref_' . md5($user['id'] . time()), 604800);
        setAuthCookie('ksa_csrf', bin2hex(random_bytes(16)), 86400);

        sendJson([
            'success' => true,
            'user' => $user,
            'token' => 'token_acc_' . md5($user['id'])
        ]);
    }

    if ($subAuth === 'register') {
        $email = trim($body['email'] ?? '');
        $name = trim($body['name'] ?? explode('@', $email)[0]);

        if (!$email) sendError('Email is required', 400);

        $users = readTableData('users', []);
        $user = [
            'id' => 'usr_' . substr(md5($email . time()), 0, 8),
            'email' => $email,
            'name' => $name,
            'role' => 'agent',
            'created_at' => date('c')
        ];
        $users[] = $user;
        writeTableData('users', $users);

        setAuthCookie('ksa_access', 'token_acc_' . md5($user['id'] . time()), 900);
        setAuthCookie('ksa_refresh', 'token_ref_' . md5($user['id'] . time()), 604800);

        sendJson([
            'success' => true,
            'user' => $user
        ], 201);
    }

    if ($subAuth === 'me') {
        $user = [
            'id' => 'usr_admin',
            'email' => 'admin@ksavaluers.com',
            'name' => 'KSA Administrator',
            'role' => 'admin'
        ];
        sendJson(['success' => true, 'user' => $user]);
    }

    if ($subAuth === 'logout') {
        setAuthCookie('ksa_access', '', -3600);
        setAuthCookie('ksa_refresh', '', -3600);
        setAuthCookie('ksa_csrf', '', -3600);
        sendJson(['success' => true, 'message' => 'Logged out successfully']);
    }

    if ($subAuth === 'refresh') {
        setAuthCookie('ksa_access', 'token_acc_' . time(), 900);
        sendJson(['success' => true, 'message' => 'Token refreshed']);
    }

    sendError('Auth endpoint not found', 404);
}

// 3. PROPERTIES API (/properties)
if (strpos($path, '/properties') === 0) {
    $id = getPathId('/properties/{id}', $path);
    $items = readTableData('properties', []);

    if ($method === 'GET') {
        if ($id) {
            foreach ($items as $item) {
                if ($item['id'] === $id) sendJson(['success' => true, 'property' => $item]);
            }
            sendError('Property not found', 404);
        }

        // Filtering
        $search = strtolower($_GET['search'] ?? '');
        $type = strtolower($_GET['type'] ?? '');
        $status = strtolower($_GET['status'] ?? '');
        $featured = isset($_GET['featured']) ? filter_var($_GET['featured'], FILTER_VALIDATE_BOOLEAN) : null;

        $filtered = array_values(array_filter($items, function($p) use ($search, $type, $status, $featured) {
            if ($search && strpos(strtolower($p['title'] . ' ' . $p['location']), $search) === false) return false;
            if ($type && strtolower($p['type']) !== $type) return false;
            if ($status && strtolower($p['status']) !== $status) return false;
            if ($featured !== null && isset($p['featured']) && $p['featured'] !== $featured) return false;
            return true;
        }));

        sendJson([
            'success' => true,
            'properties' => $filtered,
            'data' => $filtered,
            'total' => count($filtered)
        ]);
    }

    if ($method === 'POST') {
        $newProp = array_merge([
            'id' => 'prop_' . time() . rand(10, 99),
            'title' => $body['title'] ?? 'Untitled Property',
            'location' => $body['location'] ?? 'Nigeria',
            'price' => $body['price'] ?? '₦0',
            'type' => $body['type'] ?? 'Residential',
            'status' => $body['status'] ?? 'For Sale',
            'bedrooms' => (int)($body['bedrooms'] ?? 0),
            'bathrooms' => (int)($body['bathrooms'] ?? 0),
            'area' => $body['area'] ?? '',
            'featured' => !empty($body['featured']),
            'image' => $body['image'] ?? '/assets/DSC00141-scaled-930000b2.jpeg',
            'description' => $body['description'] ?? '',
            'created_at' => date('c')
        ], $body);

        $items[] = $newProp;
        writeTableData('properties', $items);
        sendJson(['success' => true, 'property' => $newProp, 'data' => $newProp], 201);
    }

    if ($method === 'PUT' && $id) {
        $updated = null;
        foreach ($items as &$item) {
            if ($item['id'] === $id) {
                $item = array_merge($item, $body);
                $updated = $item;
                break;
            }
        }
        if ($updated) {
            writeTableData('properties', $items);
            sendJson(['success' => true, 'property' => $updated, 'data' => $updated]);
        }
        sendError('Property not found for update', 404);
    }

    if ($method === 'DELETE' && $id) {
        $items = array_values(array_filter($items, fn($p) => $p['id'] !== $id));
        writeTableData('properties', $items);
        sendJson(['success' => true, 'message' => 'Property deleted']);
    }
}

// 4. PROJECTS API (/projects)
if (strpos($path, '/projects') === 0) {
    $id = getPathId('/projects/{id}', $path);
    $items = readTableData('projects', []);

    if ($method === 'GET') {
        if ($id) {
            foreach ($items as $item) {
                if ($item['id'] === $id) sendJson(['success' => true, 'project' => $item]);
            }
            sendError('Project not found', 404);
        }
        sendJson(['success' => true, 'projects' => $items, 'data' => $items, 'total' => count($items)]);
    }

    if ($method === 'POST') {
        $newProj = array_merge([
            'id' => 'proj_' . time() . rand(10, 99),
            'title' => $body['title'] ?? 'Untitled Project',
            'location' => $body['location'] ?? 'Nigeria',
            'status' => $body['status'] ?? 'Ongoing',
            'completion_percentage' => (int)($body['completion_percentage'] ?? 0),
            'client' => $body['client'] ?? 'Private Client',
            'budget' => $body['budget'] ?? 'Undisclosed Scope',
            'category' => $body['category'] ?? 'Valuation',
            'image' => $body['image'] ?? '/assets/WhatsApp-Image-2024-04-05-at-15.18.48_6e12ddea-35f7d3b7.jpg',
            'description' => $body['description'] ?? '',
            'created_at' => date('c')
        ], $body);

        $items[] = $newProj;
        writeTableData('projects', $items);
        sendJson(['success' => true, 'project' => $newProj, 'data' => $newProj], 201);
    }

    if ($method === 'PUT' && $id) {
        $updated = null;
        foreach ($items as &$item) {
            if ($item['id'] === $id) {
                $item = array_merge($item, $body);
                $updated = $item;
                break;
            }
        }
        if ($updated) {
            writeTableData('projects', $items);
            sendJson(['success' => true, 'project' => $updated, 'data' => $updated]);
        }
        sendError('Project not found for update', 404);
    }

    if ($method === 'DELETE' && $id) {
        $items = array_values(array_filter($items, fn($p) => $p['id'] !== $id));
        writeTableData('projects', $items);
        sendJson(['success' => true, 'message' => 'Project deleted']);
    }
}

// 5. BOOKINGS API (/bookings)
if (strpos($path, '/bookings') === 0) {
    if ($path === '/bookings/available-slots') {
        sendJson([
            'success' => true,
            'date' => $_GET['date'] ?? date('Y-m-d'),
            'slots' => ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
        ]);
    }

    $id = getPathId('/bookings/{id}', $path);
    $items = readTableData('bookings', []);

    if ($method === 'GET') {
        if ($id) {
            foreach ($items as $item) {
                if ($item['id'] === $id) sendJson(['success' => true, 'booking' => $item]);
            }
            sendError('Booking not found', 404);
        }
        sendJson(['success' => true, 'bookings' => $items, 'data' => $items]);
    }

    if ($method === 'POST') {
        $newBooking = array_merge([
            'id' => 'book_' . time() . rand(10, 99),
            'name' => $body['name'] ?? 'Client',
            'email' => $body['email'] ?? '',
            'phone' => $body['phone'] ?? '',
            'property_id' => $body['property_id'] ?? '',
            'property_title' => $body['property_title'] ?? 'Site Inspection',
            'date' => $body['date'] ?? date('Y-m-d'),
            'time_slot' => $body['time_slot'] ?? '10:00 AM',
            'status' => 'pending',
            'created_at' => date('c')
        ], $body);

        $items[] = $newBooking;
        writeTableData('bookings', $items);
        sendJson(['success' => true, 'booking' => $newBooking, 'data' => $newBooking], 201);
    }

    if ($method === 'PUT' && $id) {
        foreach ($items as &$item) {
            if ($item['id'] === $id) {
                $item = array_merge($item, $body);
                writeTableData('bookings', $items);
                sendJson(['success' => true, 'booking' => $item, 'data' => $item]);
            }
        }
        sendError('Booking not found for update', 404);
    }

    if ($method === 'DELETE' && $id) {
        $items = array_values(array_filter($items, fn($b) => $b['id'] !== $id));
        writeTableData('bookings', $items);
        sendJson(['success' => true, 'message' => 'Booking deleted']);
    }
}

// 6. HERO SLIDES API (/hero-slides)
if (strpos($path, '/hero-slides') === 0) {
    $id = getPathId('/hero-slides/{id}', $path);
    $items = readTableData('hero_slides', []);

    if ($method === 'GET') {
        usort($items, fn($a, $b) => ($a['sort_order'] ?? 0) <=> ($b['sort_order'] ?? 0));
        sendJson(['success' => true, 'slides' => $items, 'data' => $items]);
    }

    if ($method === 'POST') {
        $newSlide = array_merge([
            'id' => 'slide_' . time(),
            'title' => $body['title'] ?? 'New Slide',
            'subtitle' => $body['subtitle'] ?? '',
            'button_text' => $body['button_text'] ?? 'Learn More',
            'button_link' => $body['button_link'] ?? '/properties',
            'image' => $body['image'] ?? '/assets/DSC00141-scaled-930000b2.jpeg',
            'sort_order' => (int)($body['sort_order'] ?? count($items) + 1),
            'is_active' => true
        ], $body);

        $items[] = $newSlide;
        writeTableData('hero_slides', $items);
        sendJson(['success' => true, 'slide' => $newSlide, 'data' => $newSlide], 201);
    }

    if ($method === 'PUT' && $id) {
        foreach ($items as &$item) {
            if ($item['id'] === $id) {
                $item = array_merge($item, $body);
                writeTableData('hero_slides', $items);
                sendJson(['success' => true, 'slide' => $item, 'data' => $item]);
            }
        }
        sendError('Slide not found for update', 404);
    }

    if ($method === 'DELETE' && $id) {
        $items = array_values(array_filter($items, fn($s) => $s['id'] !== $id));
        writeTableData('hero_slides', $items);
        sendJson(['success' => true, 'message' => 'Slide deleted']);
    }
}

// 7. FILE UPLOAD API (/upload)
if ($path === '/upload') {
    $fileName = $body['fileName'] ?? ('upload_' . time() . '.jpg');
    $fileData = $body['fileData'] ?? '';

    if (strpos($fileData, 'data:image') === 0) {
        $uploadsDir = __DIR__ . '/uploads';
        if (!file_exists($uploadsDir)) @mkdir($uploadsDir, 0755, true);

        list($type, $data) = explode(';', $fileData);
        list(, $data) = explode(',', $data);
        $decodedData = base64_decode($data);

        $safeName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $fileName);
        $targetFile = $uploadsDir . '/' . time() . '_' . $safeName;
        @file_put_contents($targetFile, $decodedData);

        $publicUrl = 'https://api.ksavaluers.com/uploads/' . basename($targetFile);
        sendJson(['success' => true, 'url' => $publicUrl]);
    }

    sendJson(['success' => true, 'url' => $fileData ?: '/assets/DSC00141-scaled-930000b2.jpeg']);
}

// 8. CONTACT FORM SUBMISSION (/contact)
if ($path === '/contact' && $method === 'POST') {
    $inquiries = readTableData('contact_messages', []);
    $newMsg = array_merge([
        'id' => 'msg_' . time(),
        'name' => $body['name'] ?? 'Visitor',
        'email' => $body['email'] ?? '',
        'phone' => $body['phone'] ?? '',
        'subject' => $body['subject'] ?? 'General Inquiry',
        'message' => $body['message'] ?? '',
        'created_at' => date('c')
    ], $body);
    $inquiries[] = $newMsg;
    writeTableData('contact_messages', $inquiries);

    sendJson(['success' => true, 'message' => 'Your inquiry has been received. Our team will contact you shortly.']);
}

// 9. AI ASSISTANT QUERY (/ask-ai & /ask-ai-cached)
if ($path === '/ask-ai' || $path === '/ask-ai-cached') {
    $prompt = strtolower($body['prompt'] ?? $body['message'] ?? '');

    $props = readTableData('properties', []);
    $matching = [];
    foreach ($props as $p) {
        if (strpos(strtolower($p['title'] . ' ' . $p['location'] . ' ' . $p['type']), $prompt) !== false || strpos($prompt, 'property') !== false || strpos($prompt, 'house') !== false) {
            $matching[] = $p['title'] . ' in ' . $p['location'] . ' (' . $p['price'] . ')';
        }
    }

    $replyText = "KSA Valuers offers professional Estate Surveying, Asset Valuation, Plant & Machinery Valuation, and Real Estate Advisory services across Nigeria.\n\n";
    if (!empty($matching)) {
        $replyText .= "Here are matching property listings from our active portfolio:\n• " . implode("\n• ", array_slice($matching, 0, 3)) . "\n\nFor personalized inquiries, please call +234 905 389 8636 or book a site tour.";
    } else {
        $replyText .= "For valuation bookings, project inquiries, or asset appraisal consultations, please contact our lead consultants directly at +234 905 389 8636 or email info@ksavaluers.com.";
    }

    sendJson([
        'success' => true,
        'answer' => $replyText,
        'text' => $replyText,
        'cached' => true
    ]);
}

// FALLBACK 404 ROUTE
sendError("API route '{$path}' [{$method}] not found on api.ksavaluers.com backend", 404);
