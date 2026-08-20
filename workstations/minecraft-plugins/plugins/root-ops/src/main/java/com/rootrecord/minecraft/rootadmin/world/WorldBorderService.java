package com.rootrecord.minecraft.rootadmin.world;

import com.rootrecord.minecraft.rootadmin.RootAdminPlugin;
import org.bukkit.Bukkit;
import org.bukkit.World;
import org.bukkit.WorldBorder;
import org.bukkit.configuration.file.FileConfiguration;

import java.util.List;

/** Vanilla world border from root-admin.yml. Nether diameter is overworld / 8. */
public final class WorldBorderService {

    private final RootAdminPlugin plugin;

    public WorldBorderService(RootAdminPlugin plugin) {
        this.plugin = plugin;
    }

    public void applyFromConfig() {
        FileConfiguration cfg = plugin.getConfig();
        if (cfg == null || !cfg.getBoolean("world-border.enabled", true)) {
            return;
        }
        double centerX = cfg.getDouble("world-border.center-x", 0);
        double centerZ = cfg.getDouble("world-border.center-z", 0);
        int radius = Math.max(1, cfg.getInt("world-border.radius", 500));
        int warningBlocks = cfg.getInt("world-border.warning-blocks", 32);
        int warningTime = cfg.getInt("world-border.warning-time-seconds", 15);
        double damage = cfg.getDouble("world-border.damage-amount", 0);
        List<String> worlds = cfg.getStringList("world-border.worlds");
        if (worlds == null || worlds.isEmpty()) {
            worlds = List.of("world", "world_nether", "world_the_end");
        }
        double overworldDiameter = radius * 2.0;
        int applied = 0;
        for (String name : worlds) {
            if (name == null || name.isBlank()) {
                continue;
            }
            World world = Bukkit.getWorld(name.trim());
            if (world == null) {
                plugin.getLogger().warning("World border: world not loaded: " + name);
                continue;
            }
            double size = overworldDiameter;
            if (world.getEnvironment() == World.Environment.NETHER) {
                size = overworldDiameter / 8.0;
            }
            WorldBorder border = world.getWorldBorder();
            border.setCenter(centerX, centerZ);
            border.setSize(Math.max(1.0, size));
            border.setWarningDistance(Math.max(0, warningBlocks));
            border.setWarningTime(Math.max(0, warningTime));
            border.setDamageAmount(Math.max(0.0, damage));
            applied++;
        }
        plugin.getLogger().info(
                "World border applied: ±" + radius + " overworld (" + applied + " world(s); nether /8).");
    }
}
