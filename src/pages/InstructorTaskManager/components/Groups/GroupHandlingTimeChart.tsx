import {
    VictoryAxis,
    VictoryBar,
    VictoryChart, VictoryLabel,
    VictoryLegend,
    VictoryStack,
    VictoryTheme,
    VictoryTooltip,
} from 'victory';

import { GroupStats } from '@/resources/instructor/GroupStats';
import { useTranslation } from 'react-i18next';

type Props = {
    stats: GroupStats[]
}

export function GroupHandlingTimeChart({ stats }: Props) {
    const { t } = useTranslation();

    const barsData = [
        {
            name: 'intime',
            text: t('group.stats.intime'),
            color: 'green',
        },
        {
            name: 'delayed',
            text: t('group.stats.delayed'),
            color: 'yellow',
        },
        {
            name: 'missed',
            text: t('group.stats.missed'),
            color: 'red',
        },
    ];

    const legendData = barsData.map((bar) => ({
        name: bar.text,
        symbol: { fill: bar.color },
    }));

    const bars = barsData.map((bar) => {
        const data = stats.map((p: any) => ({
            x: p.name,
            y: p.submitted[bar.name],
            label: p.submitted[bar.name],
        }));

        return (
            <VictoryBar
                key={bar.name}
                data={data}
                labelComponent={<VictoryTooltip />}
            />
        );
    });

    const fontSize = 6;
    return (
        <VictoryChart
            padding={{
                top: 25,
                bottom: 60,
                left: 40,
                right: 40,
            }}
            domainPadding={{ x: 20 }}
            theme={VictoryTheme.material}
            height={250}
        >
            <VictoryLegend
                x={10}
                y={10}
                orientation="horizontal"
                symbolSpacer={5}
                gutter={20}
                data={legendData}
                height={10}
                style={{
                    labels: { fontSize },
                }}
            />
            <VictoryAxis
                style={{ tickLabels: { fontSize } }}
                tickLabelComponent={<VictoryLabel angle={45} dx={25} />}
            />
            <VictoryAxis
                dependentAxis
                style={{ tickLabels: { fontSize } }}
            />
            <VictoryStack colorScale={barsData.map((p) => p.color)}>
                {stats.length > 0 ? bars : null}
            </VictoryStack>
        </VictoryChart>
    );
}
