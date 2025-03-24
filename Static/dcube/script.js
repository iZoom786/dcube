document.getElementById('pipelineForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const source = document.getElementById('source').value;
    const dataSize = document.getElementById('dataSize').value;
    const processing = document.getElementById('processing').value;
    const warehouse = document.getElementById('warehouse').value;
    const visualization = document.getElementById('visualization').value;
    const ml = document.getElementById('ml').value;
    const tools = document.getElementById('tools').value;

    let steps = [];
    let costPerHour = 0;
    let diagram = "graph TD\n";

    // Source Ingestion
    if (source === 'streaming') {
        steps.push("1. Ingest data using Confluent Kafka (real-time streaming).");
        diagram += "A[Source] --> B[Confluent Kafka]\n";
        costPerHour += tools === 'free' ? 0 : 0.10; // Confluent Cloud basic cost
    } else {
        steps.push("1. Ingest data using Apache NiFi (batch/files).");
        diagram += "A[Source] --> B[Apache NiFi]\n";
    }

    // Processing
    if (processing === 'real-time' || processing === 'hybrid') {
        steps.push("2. Process data with Apache Kafka Streams or Flink.");
        diagram += "B --> C[Apache Kafka Streams/Flink]\n";
        costPerHour += tools === 'free' ? 0 : 0.05;
    } else {
        steps.push("2. Process data with Apache Airflow (batch scheduling).");
        diagram += "B --> C[Apache Airflow]\n";
    }

    // Warehouse
    if (warehouse === 'snowflake') {
        steps.push("3. Store data in Snowflake.");
        diagram += "C --> D[Snowflake]\n";
        costPerHour += tools === 'free' ? 0 : 2.00; // Snowflake compute cost
    } else if (warehouse === 'awsRedshift') {
        steps.push("3. Store data in AWS Redshift.");
        diagram += "C --> D[AWS Redshift]\n";
        costPerHour += tools === 'free' ? 0 : 0.25;
    } else {
        steps.push("3. Store data in Google BigQuery.");
        diagram += "C --> D[Google BigQuery]\n";
        costPerHour += tools === 'free' ? 0 : 0.20;
    }

    // Visualization
    if (visualization !== 'none') {
        steps.push(`4. Visualize data with ${visualization === 'basic' ? 'AWS QuickSight' : 'Google Data Studio'}.`);
        diagram += "D --> E[Visualization]\n";
        costPerHour += tools === 'free' ? 0 : 0.10;
    }

    // Machine Learning
    if (ml !== 'none') {
        steps.push(`5. Implement ML with ${ml === 'basic' ? 'AWS SageMaker' : 'Google AI Platform'}.`);
        diagram += "D --> F[Machine Learning]\n";
        costPerHour += tools === 'free' ? 0 : (ml === 'basic' ? 0.50 : 1.00);
    }

    // Adjust cost based on data size
    const sizeMultiplier = dataSize === 'small' ? 1 : dataSize === 'medium' ? 1.5 : 2;
    costPerHour *= sizeMultiplier;

    // Display Results
    document.getElementById('steps').innerText = steps.join('\n');
    document.getElementById('cost').innerText = `Estimated Cost: $${costPerHour.toFixed(2)} per hour`;
    document.getElementById('diagram').innerText = diagram;

    // Re-render Mermaid diagram
    mermaid.init(undefined, document.querySelector('.mermaid'));
});