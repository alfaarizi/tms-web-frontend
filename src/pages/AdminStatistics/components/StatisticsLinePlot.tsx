import {
    VictoryAxis,
    VictoryLine,
    VictoryChart, VictoryLabel,
    VictoryTooltip, VictoryScatter, VictoryGroup, VictoryLegend,
} from 'victory';

type Props = {
    input: {
        name: string,
        points: { semester: string, value: number }[],
        color: string,
    }[]
}

export function StatisticsLinePlot({
    input,
}: Props) {
    const fontSize = 7;
    return (
        <VictoryChart
            domainPadding={20}
            padding={{
                top: 10,
                bottom: 60,
                left: 40,
                right: 40,
            }}
            height={350}
            domain={{ y: [0, 1 + Math.max(...input.flatMap((elem) => elem.points.map((p) => p.value)))] }}
        >

            <VictoryAxis
                style={{ tickLabels: { fontSize } }}
                tickLabelComponent={<VictoryLabel angle={45} dx={25} />}
            />
            <VictoryAxis
                dependentAxis
                style={{ tickLabels: { fontSize } }}
            />

            <VictoryLegend
                x={50}
                y={10}
                orientation="horizontal"
                symbolSpacer={5}
                gutter={20}
                height={10}
                style={{
                    labels: { fontSize },
                }}
                data={input.map((elem) => ({
                    name: elem.name,
                    symbol: { fill: elem.color },
                }))}
            />

            {input.map((elem) => {
                const data = elem.points.map((p) => ({
                    x: p.semester,
                    y: p.value,
                }));
                return (
                    <VictoryGroup
                        key={elem.name}
                        data={data}
                    >
                        <VictoryLine style={{ data: { stroke: elem.color } }} />
                        <VictoryScatter
                            style={{ data: { fill: elem.color } }}
                            labels={({ datum }) => `${elem.name}: ${datum.y}`}
                            labelComponent={<VictoryTooltip />}
                        />
                    </VictoryGroup>
                );
            })}

        </VictoryChart>
    );
}
