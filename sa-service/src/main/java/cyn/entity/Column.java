package cyn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "sale_column")
public class Column {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @jakarta.persistence.Column(unique = true)
    String name;

    String label;

    String type;
}
