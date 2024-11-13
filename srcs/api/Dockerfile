FROM python:3.11-slim-bullseye

# Set the working directory in the container
WORKDIR /var/www/

# Install PostgreSQL client libraries and build tools
# RUN apt-get update && apt-get install -y libpq-dev gcc

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


# Copy the project files into the container
COPY . .

# Run the setup script for migrations
ENTRYPOINT [ "bash", "tools/setup.sh" ]
