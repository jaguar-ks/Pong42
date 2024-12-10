FROM python:3.12-slim-bullseye

# Set the working directory in the container
WORKDIR /var/www/

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


# Copy the project files into the container
COPY . .

# Run the setup script for migrations
ENTRYPOINT [ "bash", "tools/setup.sh" ]
