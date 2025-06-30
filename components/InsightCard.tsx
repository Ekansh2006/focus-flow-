import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Clock, CheckCircle, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from './Card';

interface InsightCardProps {
  title: string;
  value: string | number;
  type: 'trend' | 'time' | 'tasks' | 'energy';
  subtitle?: string;
  change?: number;
}

export default function InsightCard({ title, value, type, subtitle, change }: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'trend':
        return <TrendingUp size={20} color={Colors.light.primary} />;
      case 'time':
        return <Clock size={20} color={Colors.light.primary} />;
      case 'tasks':
        return <CheckCircle size={20} color={Colors.light.primary} />;
      case 'energy':
        return <Zap size={20} color={Colors.light.primary} />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    if (!change) return Colors.light.subtext;
    return change > 0 ? Colors.light.success : Colors.light.error;
  };

  const formatChange = () => {
    if (!change) return '';
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change}%`;
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.iconContainer}>{getIcon()}</View>
      </View>
      
      <Text style={styles.value}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      
      <View style={styles.footer}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        
        {change !== undefined && (
          <Text style={[styles.change, { color: getChangeColor() }]}>
            {formatChange()}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    margin: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontWeight: '500',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.subtext,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
});