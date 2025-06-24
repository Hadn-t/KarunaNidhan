# 🐾 Animal Injury Detection API

A Django backend API that allows you to upload animal images, detect injuries using Google Gemini AI, and manage injury reports.

## 🚀 Features

- Upload animal images with descriptions
- AI-powered injury detection using Google Gemini
- Location-based reporting
- Comprehensive injury report management
- RESTful API endpoints

## 🔐 Authentication

> ⚠️ **Note**: No authentication is currently required for any endpoint. **Add authentication in production for security.**

## 📡 API Endpoints

### 1. 🖼️ Upload Animal Image

**Endpoint:** `POST /animal/upload/`

Upload an animal image with description.

**Request:**
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Required Form Data:**
| Field     | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| `image`   | File   | Animal image file                       |
| `details` | String | Description of the animal or its state  |

**Example Request:**
```bash
curl -X POST http://127.0.0.1:8000/animal/upload/ \
  -F "image=@dog.jpg" \
  -F "details=Injured dog found near market"
```

**Success Response:**
```json
{
  "message": "Image and details uploaded successfully",
  "tags": ["urgent", "help-needed"],
  "image_url": "/media/animal_images/dog.jpg",
  "animal_id": 5
}
```

### 2. 📝 View Uploaded Animals

**Endpoint:** `GET /animal/upload/`

Render an HTML page showing uploaded animals.

**Request:**
- **Method:** `GET`
- **Response:** HTML page

### 3. 📋 List All Animals

**Endpoint:** `GET /animal/image-list/`

Render an HTML page with a list of all animal entries and tags.

**Request:**
- **Method:** `GET`
- **Response:** HTML page

### 4. ❌ Delete Animal Entry

**Endpoint:** `GET /animal/animal/delete/<animal_id>/`

Delete a specific animal entry and its associated image.

**Request:**
- **Method:** `GET`
- **Parameters:** `animal_id` - ID of the animal to delete

**Example Request:**
```
GET /animal/animal/delete/5/
```

**Success Response:**
```json
{
  "message": "Animal deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Error deleting animal: File not found"
}
```

### 5. 🤖 AI Injury Analysis

**Endpoint:** `POST /animal/test-gemini/`

Use Google Gemini AI to analyze an animal image for injuries.

**Request:**
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Required Form Data:**
| Field      | Type   | Description                                           |
|------------|--------|-------------------------------------------------------|
| `image`    | File   | Animal image file                                     |
| `location` | String | JSON string: `{"latitude": 12.97, "longitude": 77.59}` |

**Example Request:**
```bash
curl -X POST http://127.0.0.1:8000/animal/test-gemini/ \
  -F "image=@injured_dog.jpg" \
  -F 'location={"latitude":12.9716,"longitude":77.5946}'
```

**Success Response:**
```json
{
  "message": "Image analyzed successfully",
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "analysis_result": {
    "animal_type": "Dog",
    "breed_guess": "Labrador Retriever",
    "injury": "Leg wound",
    "severity": "High",
    "suggestions": "Bandage the wound and take the dog to a vet"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid location format"
}
```

### 6. 📦 Get Injury Reports

**Endpoint:** `GET /animal/injury-reports/`

Fetch all injury reports analyzed by Gemini AI.

**Request:**
- **Method:** `GET`
- **Response:** `application/json`

**Sample Response:**
```json
[
  {
    "report_id": "3b5c8aa6-f92c-4d1f-981e-32088cb52b1d",
    "user_id": "anonymous",
    "image_url": "http://127.0.0.1:8000/media/animal_images/dog.jpg",
    "location": "{\"latitude\": 12.9716, \"longitude\": 77.5946}",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "report_data": "{\"animal_type\": \"Dog\", \"injury\": \"leg wound\", ...}",
    "created_at": "2025-06-24T12:10:45Z"
  }
]
```

## 🧠 AI-Powered Analysis

The injury detection is powered by **Google Gemini AI** using specialized veterinary prompts:

```
"You are an expert veterinarian and animal behaviorist. Analyze the image and describe the animal_type, breed_guess, injury (if any), severity (low, moderate, high), and give brief care suggestions. Respond ONLY in JSON format like: {animal_type: ..., breed_guess: ..., injury: ..., severity: ..., suggestions: ...}"
```

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd animal-injury-detection-api
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   ```bash
   # Add your Google Gemini API key
   export GEMINI_API_KEY="your-api-key-here"
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

## 🔧 Configuration

### Environment Variables

| Variable       | Description                    | Required |
|----------------|--------------------------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key        | Yes      |
| `DEBUG`        | Django debug mode             | No       |

### Media Files

Uploaded images are stored in the `media/animal_images/` directory.

## 📝 Usage Examples

### Upload and Analyze Workflow

1. **Upload an image:**
   ```bash
   curl -X POST http://127.0.0.1:8000/animal/upload/ \
     -F "image=@injured_cat.jpg" \
     -F "details=Stray cat with visible wounds"
   ```

2. **Analyze with AI:**
   ```bash
   curl -X POST http://127.0.0.1:8000/animal/test-gemini/ \
     -F "image=@injured_cat.jpg" \
     -F 'location={"latitude":28.6139,"longitude":77.2090}'
   ```

3. **View all reports:**
   ```bash
   curl http://127.0.0.1:8000/animal/injury-reports/
   ```

## 🚨 Production Considerations

- **Authentication:** Implement proper authentication and authorization
- **Rate Limiting:** Add rate limiting to prevent API abuse
- **Input Validation:** Enhance input validation and sanitization
- **Error Handling:** Implement comprehensive error handling
- **Logging:** Add detailed logging for monitoring and debugging
- **HTTPS:** Use HTTPS in production
- **Database:** Configure production database settings

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.