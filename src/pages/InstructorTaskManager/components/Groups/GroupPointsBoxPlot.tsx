import React from 'react';
import {
    VictoryAxis,
    VictoryBoxPlot,
    VictoryChart, VictoryLabel,
    VictoryScatter,
    VictoryTooltip,
} from 'victory';

type Props = {
    data: {
        name: string,
        points: number[],
        user?: number
    }[],
    username?: string
}

export function GroupPointsBoxPlot({
    data,
    username,
}: Props) {
    const boxplotData: { x: string, y: number }[] = [];
    const scatterData: { x: string, y: number }[] = [];

    data.forEach((elem) => {
        elem.points.forEach((y) => {
            boxplotData.push({
                x: elem.name,
                y,
            });
        });

        if (elem.user) {
            scatterData.push({
                x: elem.name,
                y: elem.user,
            });
        }
    });

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
        >
            <VictoryAxis
                style={{ tickLabels: { fontSize } }}
                tickLabelComponent={<VictoryLabel angle={45} dx={25} />}
            />
            <VictoryAxis
                dependentAxis
                style={{ tickLabels: { fontSize } }}
            />

            <VictoryBoxPlot
                labels
                labelOrientation="top"
                boxWidth={10}
                whiskerWidth={5}
                data={boxplotData}
                style={{
                    min: { stroke: 'tomato' },
                    max: { stroke: 'orange' },
                    q1: { fill: 'tomato' },
                    q3: { fill: 'orange' },
                    median: {
                        stroke: 'gold',
                        strokeWidth: 2,
                    },
                    minLabels: { fontSize },
                    maxLabels: { fontSize },
                    q1Labels: { fontSize },
                    q3Labels: { fontSize },
                    medianLabels: { fontSize },
                }}
            />

            <VictoryScatter
                style={{ data: { fill: 'blue' } }}
                size={5}
                data={scatterData}
                labels={({ datum }) => (username ? `${username}: ${datum.y}` : datum.y)}
                labelComponent={<VictoryTooltip />}
            />

        </VictoryChart>
    );
}
